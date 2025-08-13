// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title EstateWill
 * @dev Smart contract for managing digital estate planning with blockchain notarization
 */
contract EstateWill {
    
    struct Will {
        string documentHash;        // IPFS hash of the will document
        address[] beneficiaries;    // List of beneficiary addresses
        uint256[] percentages;      // Percentage allocation for each beneficiary
        uint256 createdTimestamp;   // When the will was created
        uint256 lastUpdated;        // Last modification timestamp
        bool isExecuted;            // Whether the will has been executed
        bool isActive;              // Whether the will is currently active
    }
    
    struct Document {
        string documentHash;        // Hash of the document
        uint256 timestamp;          // When it was notarized
        address notarizedBy;        // Who notarized it
        string documentType;        // Type of document (will, trust, etc.)
        bool isVerified;            // Verification status
    }
    
    // Mappings
    mapping(address => Will) public wills;
    mapping(string => Document) public documents;
    mapping(address => string[]) public userDocuments;
    mapping(address => bool) public authorizedNotaries;
    
    // Events
    event WillCreated(address indexed creator, string documentHash, uint256 timestamp);
    event WillUpdated(address indexed creator, string newDocumentHash, uint256 timestamp);
    event WillExecuted(address indexed deceased, uint256 timestamp);
    event DocumentNotarized(string indexed documentHash, address indexed notary, uint256 timestamp);
    event BeneficiaryAdded(address indexed creator, address indexed beneficiary, uint256 percentage);
    event EmergencyExecutorAdded(address indexed willOwner, address indexed executor);
    
    // Modifiers
    modifier onlyWillOwner() {
        require(wills[msg.sender].isActive, "No active will found");
        _;
    }
    
    modifier onlyAuthorizedNotary() {
        require(authorizedNotaries[msg.sender], "Not an authorized notary");
        _;
    }
    
    constructor() {
        // Set contract deployer as initial authorized notary
        authorizedNotaries[msg.sender] = true;
    }
    
    /**
     * @dev Create a new will with beneficiaries and their allocations
     */
    function createWill(
        string memory _documentHash,
        address[] memory _beneficiaries,
        uint256[] memory _percentages,
        string memory _documentType
    ) external {
        require(_beneficiaries.length == _percentages.length, "Mismatched arrays");
        require(_beneficiaries.length > 0, "At least one beneficiary required");
        
        uint256 totalPercentage = 0;
        for (uint i = 0; i < _percentages.length; i++) {
            totalPercentage += _percentages[i];
        }
        require(totalPercentage == 100, "Percentages must total 100");
        
        // Create the will
        wills[msg.sender] = Will({
            documentHash: _documentHash,
            beneficiaries: _beneficiaries,
            percentages: _percentages,
            createdTimestamp: block.timestamp,
            lastUpdated: block.timestamp,
            isExecuted: false,
            isActive: true
        });
        
        // Notarize the document
        _notarizeDocument(_documentHash, _documentType);
        
        emit WillCreated(msg.sender, _documentHash, block.timestamp);
    }
    
    /**
     * @dev Update an existing will
     */
    function updateWill(
        string memory _newDocumentHash,
        address[] memory _beneficiaries,
        uint256[] memory _percentages
    ) external onlyWillOwner {
        require(_beneficiaries.length == _percentages.length, "Mismatched arrays");
        
        uint256 totalPercentage = 0;
        for (uint i = 0; i < _percentages.length; i++) {
            totalPercentage += _percentages[i];
        }
        require(totalPercentage == 100, "Percentages must total 100");
        
        Will storage will = wills[msg.sender];
        will.documentHash = _newDocumentHash;
        will.beneficiaries = _beneficiaries;
        will.percentages = _percentages;
        will.lastUpdated = block.timestamp;
        
        // Notarize the updated document
        _notarizeDocument(_newDocumentHash, "updated_will");
        
        emit WillUpdated(msg.sender, _newDocumentHash, block.timestamp);
    }
    
    /**
     * @dev Execute a will (distribute assets to beneficiaries)
     */
    function executeWill(address _deceased) external {
        Will storage will = wills[_deceased];
        require(will.isActive, "Will not found or not active");
        require(!will.isExecuted, "Will already executed");
        
        // Mark will as executed
        will.isExecuted = true;
        will.isActive = false;
        
        emit WillExecuted(_deceased, block.timestamp);
        
        // Note: Actual asset distribution would require additional logic
        // depending on the types of assets (ETH, ERC20 tokens, NFTs, etc.)
    }
    
    /**
     * @dev Notarize a document on the blockchain
     */
    function notarizeDocument(string memory _documentHash, string memory _documentType) external {
        _notarizeDocument(_documentHash, _documentType);
    }
    
    /**
     * @dev Internal function to notarize documents
     */
    function _notarizeDocument(string memory _documentHash, string memory _documentType) internal {
        documents[_documentHash] = Document({
            documentHash: _documentHash,
            timestamp: block.timestamp,
            notarizedBy: msg.sender,
            documentType: _documentType,
            isVerified: true
        });
        
        userDocuments[msg.sender].push(_documentHash);
        
        emit DocumentNotarized(_documentHash, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Verify if a document is notarized and get its timestamp
     */
    function verifyDocument(string memory _documentHash) external view returns (
        bool isVerified,
        uint256 timestamp,
        address notarizedBy,
        string memory documentType
    ) {
        Document memory doc = documents[_documentHash];
        return (doc.isVerified, doc.timestamp, doc.notarizedBy, doc.documentType);
    }
    
    /**
     * @dev Get will information for an address
     */
    function getWill(address _owner) external view returns (
        string memory documentHash,
        address[] memory beneficiaries,
        uint256[] memory percentages,
        uint256 createdTimestamp,
        uint256 lastUpdated,
        bool isExecuted,
        bool isActive
    ) {
        Will memory will = wills[_owner];
        return (
            will.documentHash,
            will.beneficiaries,
            will.percentages,
            will.createdTimestamp,
            will.lastUpdated,
            will.isExecuted,
            will.isActive
        );
    }
    
    /**
     * @dev Get all documents notarized by a user
     */
    function getUserDocuments(address _user) external view returns (string[] memory) {
        return userDocuments[_user];
    }
    
    /**
     * @dev Add authorized notary (only contract owner)
     */
    function addAuthorizedNotary(address _notary) external {
        // In a real implementation, this would have proper access control
        authorizedNotaries[_notary] = true;
    }
    
    /**
     * @dev Emergency function to deactivate a will
     */
    function deactivateWill() external onlyWillOwner {
        wills[msg.sender].isActive = false;
    }
    
    /**
     * @dev Get the total number of active wills
     */
    function getActiveWillsCount() external view returns (uint256) {
        // This would require additional tracking in a real implementation
        return 0; // Placeholder
    }
}