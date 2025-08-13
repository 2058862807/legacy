import os, requests
from typing import Tuple

# Basic Namecheap DNS update via their v2 API gateway
# Requires public IP allowlisting in Namecheap
API_USER = os.getenv("NAMECHEAP_API_USER", "")
API_KEY = os.getenv("NAMECHEAP_API_KEY", "")

def set_a_record(domain: str, host: str, ip: str, ttl: int = 300) -> Tuple[bool, str]:
    if not API_USER or not API_KEY:
        return False, "Namecheap API credentials missing"
    # Namecheap API uses a setHosts call, which replaces the entire host list.
    # In production, fetch existing records, merge, then update.
    # Here we write a single A record as a minimal helper.
    "sld, tld = domain.split(".", 1)
endpoint = "https://api.namecheap.com/xml.response"
params = {
    "ApiUser": API_USER,
    "ApiKey": API_KEY,
    "UserName": API_USER,
    "Command": "namecheap.domains.dns.setHosts",
    "ClientIp": "0.0.0.0",
    "SLD": sld,
    "TLD": tld,
    "HostName1": host,
    "RecordType1": "A",
    "Address1": ip,
    "TTL1": str(ttl),
}
try:
    r = requests.get(endpoint, params=params, timeout=30)
    if r.status_code != 200:
        return False, f"http {r.status_code}"
    ok = '<ApiResponse Status="OK"' in r.text and '<DomainDNSSetHostsResult IsSuccess="true"' in r.text
    return (True, "updated") if ok else (False, r.text[:500])
except Exception as e:
    return False, str(e)

ok = '<ApiResponse Status="OK"' in r.text and '<DomainDNSSetHostsResult IsSuccess="true"' in r.text

        return (True, "updated") if ok else (False, r.text[:500])
    except Exception as e:
        return False, str(e)
