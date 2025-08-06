// Comprehensive 50-State Legal Compliance System for NextEra Estate
import CryptoJS from 'crypto-js';

// Complete US State Estate Planning Legal Database
export const US_STATES_COMPLIANCE = {
  // ALABAMA
  'AL': {
    name: 'Alabama',
    fullName: 'Alabama',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'entirety',
      estateTaxThreshold: 0, // No state estate tax
      probateRequired: true,
      probateThreshold: 43000
    },
    specificRules: [
      'Holographic wills must be entirely in testator\'s handwriting',
      'Self-proving affidavit can eliminate need for witness testimony',
      'Community property state rules do not apply'
    ]
  },

  // ALASKA
  'AK': {
    name: 'Alaska',
    fullName: 'Alaska',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: false,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'entirety',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 15000
    },
    specificRules: [
      'Does not recognize holographic wills',
      'Community property opt-in state',
      'Strong digital assets protection laws'
    ]
  },

  // ARIZONA
  'AZ': {
    name: 'Arizona',
    fullName: 'Arizona',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'community_property',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 100000
    },
    specificRules: [
      'Community property state',
      'Holographic wills recognized if material provisions in handwriting',
      'Digital assets covered under Revised Uniform Fiduciary Access Act'
    ]
  },

  // ARKANSAS
  'AR': {
    name: 'Arkansas',
    fullName: 'Arkansas',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'dower_curtesy',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 100000
    },
    specificRules: [
      'Holographic wills fully recognized',
      'Dower and curtesy rights still apply',
      'Self-proving affidavit strongly recommended'
    ]
  },

  // CALIFORNIA
  'CA': {
    name: 'California',
    fullName: 'California',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'community_property',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 184500
    },
    specificRules: [
      'Community property state',
      'Holographic wills recognized',
      'Comprehensive digital assets legislation (RUFADAA)',
      'Statutory will form available',
      'Strong beneficiary rights protection'
    ]
  },

  // COLORADO
  'CO': {
    name: 'Colorado',
    fullName: 'Colorado',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'entirety',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 70000
    },
    specificRules: [
      'Holographic wills recognized',
      'Small estate affidavit process available',
      'Digital assets protection under RUFADAA'
    ]
  },

  // CONNECTICUT
  'CT': {
    name: 'Connecticut',
    fullName: 'Connecticut',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: false,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 12920000,
      probateRequired: true,
      probateThreshold: 40000
    },
    specificRules: [
      'Does not recognize holographic wills',
      'State estate tax applies above threshold',
      'Elective share: 1/3 of estate',
      'Digital assets covered'
    ]
  },

  // DELAWARE
  'DE': {
    name: 'Delaware',
    fullName: 'Delaware',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: false,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 30000
    },
    specificRules: [
      'Does not recognize holographic wills',
      'Elective share: 1/3 of augmented estate',
      'Strong privacy protections for trusts'
    ]
  },

  // FLORIDA
  'FL': {
    name: 'Florida',
    fullName: 'Florida',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: false,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 75000
    },
    specificRules: [
      'Does not recognize holographic wills',
      'Homestead property has special protection',
      'Elective share: 30% of elective estate',
      'Summary probate for small estates'
    ]
  },

  // GEORGIA
  'GA': {
    name: 'Georgia',
    fullName: 'Georgia',
    willRequirements: {
      minimumAge: 14,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: false,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'intestacy_share',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 10000
    },
    specificRules: [
      'Minimum age is 14 years old',
      'Does not recognize holographic wills',
      'Year\'s support allowance for family',
      'Solemn form probate recommended'
    ]
  },

  // HAWAII
  'HI': {
    name: 'Hawaii',
    fullName: 'Hawaii',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: false,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'entirety',
      estateTaxThreshold: 5490000,
      probateRequired: true,
      probateThreshold: 100000
    },
    specificRules: [
      'Does not recognize holographic wills',
      'State estate tax applies',
      'Simplified probate for small estates',
      'Strong digital assets protection'
    ]
  },

  // IDAHO
  'ID': {
    name: 'Idaho',
    fullName: 'Idaho',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'community_property',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 100000
    },
    specificRules: [
      'Community property state',
      'Holographic wills recognized',
      'Summary probate available for small estates'
    ]
  },

  // ILLINOIS
  'IL': {
    name: 'Illinois',
    fullName: 'Illinois',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: false,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 4000000,
      probateRequired: true,
      probateThreshold: 100000
    },
    specificRules: [
      'Does not recognize holographic wills',
      'State estate tax applies',
      'Elective share: 1/3 of estate',
      'Small estate affidavit available'
    ]
  },

  // INDIANA
  'IN': {
    name: 'Indiana',
    fullName: 'Indiana',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: false,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 50000
    },
    specificRules: [
      'Does not recognize holographic wills',
      'Elective share available to spouse',
      'Summary probate for estates under threshold'
    ]
  },

  // IOWA
  'IA': {
    name: 'Iowa',
    fullName: 'Iowa',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 25000,
      probateRequired: true,
      probateThreshold: 25000
    },
    specificRules: [
      'Holographic wills recognized',
      'Low state estate tax threshold',
      'Elective share: 1/3 of estate'
    ]
  },

  // KANSAS
  'KS': {
    name: 'Kansas',
    fullName: 'Kansas',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'entirety',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 40000
    },
    specificRules: [
      'Holographic wills recognized',
      'Summary probate available',
      'Homestead protection available'
    ]
  },

  // KENTUCKY
  'KY': {
    name: 'Kentucky',
    fullName: 'Kentucky',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'dower_curtesy',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 15000
    },
    specificRules: [
      'Holographic wills recognized',
      'Dower and curtesy still apply',
      'Year\'s support for surviving family'
    ]
  },

  // LOUISIANA
  'LA': {
    name: 'Louisiana',
    fullName: 'Louisiana',
    willRequirements: {
      minimumAge: 16,
      witnessesRequired: 2,
      notarizationRequired: true,
      selfProving: false,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'community_property',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 125000
    },
    specificRules: [
      'Unique civil law system based on Napoleonic Code',
      'Forced heirship for children under 24',
      'Community property state',
      'Notarization required for most wills',
      'Holographic wills allowed with special rules'
    ]
  },

  // MAINE
  'ME': {
    name: 'Maine',
    fullName: 'Maine',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 6800000,
      probateRequired: true,
      probateThreshold: 40000
    },
    specificRules: [
      'Holographic wills recognized',
      'State estate tax applies',
      'Elective share available'
    ]
  },

  // MARYLAND
  'MD': {
    name: 'Maryland',
    fullName: 'Maryland',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 5000000,
      probateRequired: true,
      probateThreshold: 50000
    },
    specificRules: [
      'Holographic wills recognized',
      'State estate tax applies',
      'Elective share: 1/3 of estate'
    ]
  },

  // MASSACHUSETTS
  'MA': {
    name: 'Massachusetts',
    fullName: 'Massachusetts',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: false,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 2000000,
      probateRequired: true,
      probateThreshold: 25000
    },
    specificRules: [
      'Does not recognize holographic wills',
      'Low state estate tax threshold',
      'Elective share available',
      'Voluntary administration for small estates'
    ]
  },

  // MICHIGAN
  'MI': {
    name: 'Michigan',
    fullName: 'Michigan',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 24000
    },
    specificRules: [
      'Holographic wills recognized',
      'Elective share available',
      'Summary probate for small estates'
    ]
  },

  // MINNESOTA
  'MN': {
    name: 'Minnesota',
    fullName: 'Minnesota',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: false,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 3000000,
      probateRequired: true,
      probateThreshold: 75000
    },
    specificRules: [
      'Does not recognize holographic wills',
      'State estate tax applies',
      'Elective share available'
    ]
  },

  // MISSISSIPPI
  'MS': {
    name: 'Mississippi',
    fullName: 'Mississippi',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'entirety',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 50000
    },
    specificRules: [
      'Holographic wills recognized',
      'Summary probate available',
      'Homestead exemption available'
    ]
  },

  // MISSOURI
  'MO': {
    name: 'Missouri',
    fullName: 'Missouri',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 40000
    },
    specificRules: [
      'Holographic wills recognized',
      'Elective share available',
      'Summary probate for small estates'
    ]
  },

  // MONTANA
  'MT': {
    name: 'Montana',
    fullName: 'Montana',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 50000
    },
    specificRules: [
      'Holographic wills recognized',
      'Elective share available',
      'Summary probate available'
    ]
  },

  // NEBRASKA
  'NE': {
    name: 'Nebraska',
    fullName: 'Nebraska',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 50000
    },
    specificRules: [
      'Holographic wills recognized',
      'Elective share available',
      'Summary administration available'
    ]
  },

  // NEVADA
  'NV': {
    name: 'Nevada',
    fullName: 'Nevada',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'community_property',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 300000
    },
    specificRules: [
      'Community property state',
      'Holographic wills recognized',
      'High probate threshold',
      'Strong asset protection laws'
    ]
  },

  // NEW HAMPSHIRE
  'NH': {
    name: 'New Hampshire',
    fullName: 'New Hampshire',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: false,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 10000
    },
    specificRules: [
      'Does not recognize holographic wills',
      'Elective share available',
      'Voluntary administration available'
    ]
  },

  // NEW JERSEY
  'NJ': {
    name: 'New Jersey',
    fullName: 'New Jersey',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 2000000,
      probateRequired: true,
      probateThreshold: 50000
    },
    specificRules: [
      'Holographic wills recognized',
      'State estate tax applies',
      'Elective share available'
    ]
  },

  // NEW MEXICO
  'NM': {
    name: 'New Mexico',
    fullName: 'New Mexico',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'community_property',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 50000
    },
    specificRules: [
      'Community property state',
      'Holographic wills recognized',
      'Summary probate available'
    ]
  },

  // NEW YORK
  'NY': {
    name: 'New York',
    fullName: 'New York',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: false,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 6940000,
      probateRequired: true,
      probateThreshold: 50000
    },
    specificRules: [
      'Does not recognize holographic wills',
      'State estate tax applies',
      'Elective share: $50,000 or 1/3 of estate',
      'Voluntary administration for small estates'
    ]
  },

  // NORTH CAROLINA
  'NC': {
    name: 'North Carolina',
    fullName: 'North Carolina',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 30000
    },
    specificRules: [
      'Holographic wills recognized',
      'Elective share available',
      'Summary administration available'
    ]
  },

  // NORTH DAKOTA
  'ND': {
    name: 'North Dakota',
    fullName: 'North Dakota',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 50000
    },
    specificRules: [
      'Holographic wills recognized',
      'Elective share available',
      'Summary probate available'
    ]
  },

  // OHIO
  'OH': {
    name: 'Ohio',
    fullName: 'Ohio',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: false,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 35000
    },
    specificRules: [
      'Does not recognize holographic wills',
      'Elective share available',
      'Release from administration available'
    ]
  },

  // OKLAHOMA
  'OK': {
    name: 'Oklahoma',
    fullName: 'Oklahoma',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'entirety',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 20000
    },
    specificRules: [
      'Holographic wills recognized',
      'Summary probate available',
      'Homestead protection available'
    ]
  },

  // OREGON
  'OR': {
    name: 'Oregon',
    fullName: 'Oregon',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 275000
    },
    specificRules: [
      'Holographic wills recognized',
      'High probate threshold',
      'Summary probate available'
    ]
  },

  // PENNSYLVANIA
  'PA': {
    name: 'Pennsylvania',
    fullName: 'Pennsylvania',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 50000
    },
    specificRules: [
      'Holographic wills recognized',
      'Elective share available',
      'Small estate procedures available'
    ]
  },

  // RHODE ISLAND
  'RI': {
    name: 'Rhode Island',
    fullName: 'Rhode Island',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: false,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 1774000,
      probateRequired: true,
      probateThreshold: 15000
    },
    specificRules: [
      'Does not recognize holographic wills',
      'State estate tax applies',
      'Elective share available'
    ]
  },

  // SOUTH CAROLINA
  'SC': {
    name: 'South Carolina',
    fullName: 'South Carolina',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 3,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 25000
    },
    specificRules: [
      'Requires 3 witnesses (unique)',
      'Holographic wills recognized',
      'Elective share available'
    ]
  },

  // SOUTH DAKOTA
  'SD': {
    name: 'South Dakota',
    fullName: 'South Dakota',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 50000
    },
    specificRules: [
      'Holographic wills recognized',
      'Elective share available',
      'Strong trust laws'
    ]
  },

  // TENNESSEE
  'TN': {
    name: 'Tennessee',
    fullName: 'Tennessee',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 50000
    },
    specificRules: [
      'Holographic wills recognized',
      'Elective share available',
      'Summary probate available'
    ]
  },

  // TEXAS
  'TX': {
    name: 'Texas',
    fullName: 'Texas',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'community_property',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 75000
    },
    specificRules: [
      'Community property state',
      'Holographic wills recognized',
      'Independent administration preferred',
      'Strong homestead protection'
    ]
  },

  // UTAH
  'UT': {
    name: 'Utah',
    fullName: 'Utah',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 100000
    },
    specificRules: [
      'Holographic wills recognized',
      'Elective share available',
      'Summary probate available'
    ]
  },

  // VERMONT
  'VT': {
    name: 'Vermont',
    fullName: 'Vermont',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 3,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: false,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 5000000,
      probateRequired: true,
      probateThreshold: 45000
    },
    specificRules: [
      'Requires 3 witnesses',
      'Does not recognize holographic wills',
      'State estate tax applies'
    ]
  },

  // VIRGINIA
  'VA': {
    name: 'Virginia',
    fullName: 'Virginia',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 50000
    },
    specificRules: [
      'Holographic wills recognized',
      'Elective share available',
      'Summary probate available'
    ]
  },

  // WASHINGTON
  'WA': {
    name: 'Washington',
    fullName: 'Washington',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: false,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'community_property',
      estateTaxThreshold: 2193000,
      probateRequired: true,
      probateThreshold: 100000
    },
    specificRules: [
      'Community property state',
      'Does not recognize holographic wills',
      'State estate tax applies'
    ]
  },

  // WEST VIRGINIA
  'WV': {
    name: 'West Virginia',
    fullName: 'West Virginia',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 50000
    },
    specificRules: [
      'Holographic wills recognized',
      'Elective share available',
      'Summary settlement available'
    ]
  },

  // WISCONSIN
  'WI': {
    name: 'Wisconsin',
    fullName: 'Wisconsin',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: false,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'marital_property',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 50000
    },
    specificRules: [
      'Marital property state (similar to community property)',
      'Does not recognize holographic wills',
      'Summary probate available'
    ]
  },

  // WYOMING
  'WY': {
    name: 'Wyoming',
    fullName: 'Wyoming',
    willRequirements: {
      minimumAge: 18,
      witnessesRequired: 2,
      notarizationRequired: false,
      selfProving: true,
      holographicWills: true,
      digitalAssetsRecognized: true
    },
    inheritance: {
      spouseShare: 'elective_share',
      estateTaxThreshold: 0,
      probateRequired: true,
      probateThreshold: 200000
    },
    specificRules: [
      'Holographic wills recognized',
      'High probate threshold',
      'Strong asset protection laws'
    ]
  }
};

// AI Compliance Service for All 50 States
export class StateComplianceService {
  constructor() {
    this.lastUpdate = new Date();
  }

  // Get compliance requirements for a specific state
  getStateCompliance(stateCode) {
    const state = US_STATES_COMPLIANCE[stateCode?.toUpperCase()];
    if (!state) {
      throw new Error(`State code ${stateCode} not found`);
    }
    return state;
  }

  // Get all available states
  getAllStates() {
    return Object.entries(US_STATES_COMPLIANCE).map(([code, data]) => ({
      code,
      name: data.name,
      fullName: data.fullName
    }));
  }

  // Validate will requirements for specific state
  validateWillRequirements(willData, stateCode) {
    const state = this.getStateCompliance(stateCode);
    const errors = [];
    const warnings = [];
    const recommendations = [];

    // Age validation
    if (willData.age < state.willRequirements.minimumAge) {
      errors.push(`Minimum age for creating a will in ${state.fullName} is ${state.willRequirements.minimumAge}`);
    }

    // Witness requirements
    if (!willData.witnesses || willData.witnesses.length < state.willRequirements.witnessesRequired) {
      errors.push(`${state.fullName} requires ${state.willRequirements.witnessesRequired} witnesses`);
    }

    // Notarization requirements
    if (state.willRequirements.notarizationRequired && !willData.notarized) {
      errors.push(`${state.fullName} requires notarization of wills`);
    }

    // Self-proving affidavit recommendation
    if (state.willRequirements.selfProving && !willData.selfProving) {
      recommendations.push(`Consider adding a self-proving affidavit in ${state.fullName} to simplify probate`);
    }

    // Holographic will warnings
    if (willData.isHolographic && !state.willRequirements.holographicWills) {
      errors.push(`${state.fullName} does not recognize holographic (handwritten) wills`);
    }

    // Estate tax warnings
    if (state.inheritance.estateTaxThreshold > 0 && willData.estateValue > state.inheritance.estateTaxThreshold) {
      warnings.push(`Estate may be subject to ${state.fullName} state estate tax (threshold: $${state.inheritance.estateTaxThreshold.toLocaleString()})`);
    }

    // Community property state warnings
    if (state.inheritance.spouseShare === 'community_property' && willData.maritalStatus === 'married') {
      warnings.push(`${state.fullName} is a community property state - special rules apply to married couples`);
    }

    return {
      isValid: errors.length === 0,
      state: state.fullName,
      stateCode,
      errors,
      warnings,
      recommendations,
      compliance: {
        minimumAge: willData.age >= state.willRequirements.minimumAge,
        witnessRequirement: willData.witnesses?.length >= state.willRequirements.witnessesRequired,
        notarization: !state.willRequirements.notarizationRequired || willData.notarized,
        holographicAllowed: !willData.isHolographic || state.willRequirements.holographicWills
      }
    };
  }

  // Get state-specific recommendations
  getStateRecommendations(stateCode, willData) {
    const state = this.getStateCompliance(stateCode);
    const recommendations = [];

    // State-specific recommendations
    state.specificRules.forEach(rule => {
      recommendations.push(`${state.fullName}: ${rule}`);
    });

    // Probate threshold guidance
    if (willData.estateValue && willData.estateValue < state.inheritance.probateThreshold) {
      recommendations.push(`Your estate may qualify for simplified probate in ${state.fullName} (threshold: $${state.inheritance.probateThreshold.toLocaleString()})`);
    }

    // Digital assets guidance
    if (state.willRequirements.digitalAssetsRecognized) {
      recommendations.push(`${state.fullName} recognizes digital assets - consider including cryptocurrency, NFTs, and digital accounts in your will`);
    }

    return recommendations;
  }

  // Compare requirements across multiple states
  compareStates(stateCodes) {
    const comparison = {};
    
    stateCodes.forEach(code => {
      const state = this.getStateCompliance(code);
      comparison[code] = {
        name: state.fullName,
        minimumAge: state.willRequirements.minimumAge,
        witnesses: state.willRequirements.witnessesRequired,
        notarization: state.willRequirements.notarizationRequired,
        holographic: state.willRequirements.holographicWills,
        estateTax: state.inheritance.estateTaxThreshold,
        probateThreshold: state.inheritance.probateThreshold
      };
    });

    return comparison;
  }

  // Get jurisdiction-specific legal updates
  getLegalUpdates(stateCode) {
    // Simulate recent legal updates
    const updates = [
      {
        date: '2025-01-01',
        type: 'Estate Tax',
        description: 'State estate tax thresholds updated for 2025',
        impact: 'moderate'
      },
      {
        date: '2024-12-15',
        type: 'Digital Assets',
        description: 'New regulations for cryptocurrency inheritance',
        impact: 'high'
      },
      {
        date: '2024-11-01',
        type: 'Probate Rules',
        description: 'Simplified probate procedures for small estates',
        impact: 'low'
      }
    ];

    return updates;
  }

  // Generate state-specific compliance report
  generateComplianceReport(willData, stateCode) {
    const validation = this.validateWillRequirements(willData, stateCode);
    const recommendations = this.getStateRecommendations(stateCode, willData);
    const updates = this.getLegalUpdates(stateCode);
    const state = this.getStateCompliance(stateCode);

    return {
      ...validation,
      recommendations,
      legalUpdates: updates,
      stateInfo: {
        name: state.fullName,
        lastUpdated: this.lastUpdate,
        specificRules: state.specificRules
      },
      blockchainCompliance: {
        supported: true,
        smartContractRecognition: 'experimental',
        digitalAssetLaws: state.willRequirements.digitalAssetsRecognized
      }
    };
  }
}

  // Helper function to convert full state name to state code
  getStateCodeFromFullName(fullStateName) {
    // Handle formats like "California, USA", "California", or "CA"
    const cleanName = fullStateName.replace(', USA', '').trim();
    
    // If already a code, return as-is
    if (cleanName.length === 2 && US_STATES_COMPLIANCE[cleanName.toUpperCase()]) {
      return cleanName.toUpperCase();
    }
    
    // Search for matching state name
    for (const [code, data] of Object.entries(US_STATES_COMPLIANCE)) {
      if (data.name.toLowerCase() === cleanName.toLowerCase() || 
          data.fullName.toLowerCase() === cleanName.toLowerCase()) {
        return code;
      }
    }
    
    throw new Error(`State not found: ${fullStateName}`);
  }

  // Helper function to get full state name with country
  getFullStateNameWithCountry(stateCode) {
    const state = this.getStateCompliance(stateCode);
    return `${state.fullName}, USA`;
  }
}

// Export singleton instance
export const stateComplianceService = new StateComplianceService();