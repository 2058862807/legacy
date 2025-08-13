import os, imaplib, smtplib, email
from email.header import decode_header, make_header
from email.message import EmailMessage
from typing import List, Optional

SMTP_HOST = os.getenv("EMAIL_SMTP_HOST", "")
SMTP_PORT = int(os.getenv("EMAIL_SMTP_PORT", "587"))
IMAP_HOST = os.getenv("EMAIL_IMAP_HOST", "")
EMAIL_ADDR = os.getenv("EMAIL_ADDRESS", "")
EMAIL_PWD = os.getenv("EMAIL_PASSWORD", "")

def fetch_unread(search: str = "UNSEEN") -> List[email.message.Message]:
    msgs = []
    with imaplib.IMAP4_SSL(IMAP_HOST) as M:
        M.login(EMAIL_ADDR, EMAIL_PWD)
        M.select("INBOX")
        typ, data = M.search(None, search) if search != "UNSEEN" else M.search(None, "UNSEEN")
        ids = data[0].split()
        for i in ids:
            typ, msgdata = M.fetch(i, "(RFC822)")
            msg = email.message_from_bytes(msgdata[0][1])
            msgs.append(msg)
    return msgs

def send_reply(original_msg: email.message.Message, reply_text: str) -> None:
    to_addr = original_msg.get("Reply-To") or original_msg.get("From")
    subj = original_msg.get("Subject") or ""
    reply = EmailMessage()
    reply["From"] = EMAIL_ADDR
    reply["To"] = to_addr
    reply["Subject"] = "Re: " + str(make_header(decode_header(subj)))
    reply.set_content(reply_text)

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as s:
        s.starttls()
        s.login(EMAIL_ADDR, EMAIL_PWD)
        s.send_message(reply)
