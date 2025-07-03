<template>
  <div class="space-y-2">
    <div class="relative">
      <!-- Country flag and code selector -->
      <div class="absolute inset-y-0 left-0 flex items-center">
        <button
          type="button"
          @click="toggleCountryDropdown"
          class="flex items-center space-x-2 pl-3 pr-2 py-3 border-r border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors rounded-l-lg"
          :class="{ 'ring-2 ring-blue-500': isCountryDropdownOpen }"
        >
          <span class="text-lg">{{ selectedCountry.flag }}</span>
          <span class="text-sm font-medium text-slate-600">{{ selectedCountry.code }}</span>
          <svg 
            class="w-4 h-4 text-slate-400 transition-transform" 
            :class="{ 'rotate-180': isCountryDropdownOpen }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        
        <!-- Country dropdown -->
        <div 
          v-if="isCountryDropdownOpen"
          class="absolute top-full left-0 mt-1 w-80 bg-white border border-slate-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          <!-- Search input -->
          <div class="p-3 border-b border-slate-200">
            <input
              v-model="countrySearch"
              type="text"
              placeholder="Rechercher un pays..."
              class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <!-- Country list -->
          <div class="py-1">
            <button
              v-for="country in filteredCountries"
              :key="country.iso2"
              type="button"
              @click="selectCountry(country)"
              class="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center space-x-3"
              :class="{ 'bg-blue-50 text-blue-600': selectedCountry.iso2 === country.iso2 }"
            >
              <span class="text-lg">{{ country.flag }}</span>
              <span class="text-sm font-medium">{{ country.code }}</span>
              <span class="text-sm text-slate-600 truncate">{{ country.name }}</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Phone number input -->
      <input
        v-model="phoneNumber"
        type="tel"
        :placeholder="phonePlaceholder"
        class="w-full pl-24 pr-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        :class="{ 'border-red-300 ring-1 ring-red-500': hasError }"
        @input="validateAndFormat"
      />
    </div>
    
    <!-- Error message -->
    <p v-if="hasError && errorMessage" class="text-sm text-red-600">
      {{ errorMessage }}
    </p>
    
    <!-- Format example -->
    <p v-if="!hasError && phoneExample" class="text-xs text-slate-500">
      Exemple: {{ phoneExample }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { parsePhoneNumber, getExampleNumber, formatIncompletePhoneNumber } from 'libphonenumber-js'
import examples from 'libphonenumber-js/mobile/examples'

interface Country {
  iso2: string
  name: string
  code: string
  flag: string
}

interface Props {
  modelValue?: string
  required?: boolean
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  required: false,
  disabled: false
})

const emit = defineEmits<Emits>()

// Countries data - Liste complète
const countries: Country[] = [
  { iso2: 'AF', name: 'Afghanistan', code: '+93', flag: '🇦🇫' },
  { iso2: 'AL', name: 'Albanie', code: '+355', flag: '🇦🇱' },
  { iso2: 'DZ', name: 'Algérie', code: '+213', flag: '🇩🇿' },
  { iso2: 'AD', name: 'Andorre', code: '+376', flag: '🇦🇩' },
  { iso2: 'AO', name: 'Angola', code: '+244', flag: '🇦🇴' },
  { iso2: 'AR', name: 'Argentine', code: '+54', flag: '🇦🇷' },
  { iso2: 'AM', name: 'Arménie', code: '+374', flag: '🇦🇲' },
  { iso2: 'AU', name: 'Australie', code: '+61', flag: '🇦🇺' },
  { iso2: 'AT', name: 'Autriche', code: '+43', flag: '🇦🇹' },
  { iso2: 'AZ', name: 'Azerbaïdjan', code: '+994', flag: '🇦🇿' },
  { iso2: 'BH', name: 'Bahreïn', code: '+973', flag: '��' },
  { iso2: 'BD', name: 'Bangladesh', code: '+880', flag: '🇧🇩' },
  { iso2: 'BY', name: 'Biélorussie', code: '+375', flag: '🇧🇾' },
  { iso2: 'BE', name: 'Belgique', code: '+32', flag: '🇧🇪' },
  { iso2: 'BZ', name: 'Belize', code: '+501', flag: '🇧🇿' },
  { iso2: 'BJ', name: 'Bénin', code: '+229', flag: '🇧🇯' },
  { iso2: 'BO', name: 'Bolivie', code: '+591', flag: '🇧🇴' },
  { iso2: 'BA', name: 'Bosnie-Herzégovine', code: '+387', flag: '🇧🇦' },
  { iso2: 'BW', name: 'Botswana', code: '+267', flag: '🇧🇼' },
  { iso2: 'BR', name: 'Brésil', code: '+55', flag: '🇧🇷' },
  { iso2: 'BG', name: 'Bulgarie', code: '+359', flag: '🇧🇬' },
  { iso2: 'BF', name: 'Burkina Faso', code: '+226', flag: '🇧🇫' },
  { iso2: 'BI', name: 'Burundi', code: '+257', flag: '🇧🇮' },
  { iso2: 'KH', name: 'Cambodge', code: '+855', flag: '🇰🇭' },
  { iso2: 'CM', name: 'Cameroun', code: '+237', flag: '🇨🇲' },
  { iso2: 'CA', name: 'Canada', code: '+1', flag: '🇨🇦' },
  { iso2: 'CV', name: 'Cap-Vert', code: '+238', flag: '🇨🇻' },
  { iso2: 'CL', name: 'Chili', code: '+56', flag: '🇨🇱' },
  { iso2: 'CN', name: 'Chine', code: '+86', flag: '🇨🇳' },
  { iso2: 'CY', name: 'Chypre', code: '+357', flag: '🇨🇾' },
  { iso2: 'CO', name: 'Colombie', code: '+57', flag: '🇨🇴' },
  { iso2: 'KM', name: 'Comores', code: '+269', flag: '🇰🇲' },
  { iso2: 'CG', name: 'Congo', code: '+242', flag: '🇨🇬' },
  { iso2: 'CD', name: 'Congo (RDC)', code: '+243', flag: '🇨🇩' },
  { iso2: 'KR', name: 'Corée du Sud', code: '+82', flag: '🇰🇷' },
  { iso2: 'KP', name: 'Corée du Nord', code: '+850', flag: '🇰🇵' },
  { iso2: 'CR', name: 'Costa Rica', code: '+506', flag: '🇨🇷' },
  { iso2: 'CI', name: 'Côte d\'Ivoire', code: '+225', flag: '🇨�' },
  { iso2: 'HR', name: 'Croatie', code: '+385', flag: '�🇭🇷' },
  { iso2: 'CU', name: 'Cuba', code: '+53', flag: '🇨🇺' },
  { iso2: 'DK', name: 'Danemark', code: '+45', flag: '🇩🇰' },
  { iso2: 'DJ', name: 'Djibouti', code: '+253', flag: '🇩🇯' },
  { iso2: 'DO', name: 'République Dominicaine', code: '+1809', flag: '🇩🇴' },
  { iso2: 'EG', name: 'Égypte', code: '+20', flag: '🇪🇬' },
  { iso2: 'SV', name: 'Salvador', code: '+503', flag: '🇸🇻' },
  { iso2: 'AE', name: 'Émirats Arabes Unis', code: '+971', flag: '�🇪' },
  { iso2: 'EC', name: 'Équateur', code: '+593', flag: '🇪�🇨' },
  { iso2: 'ER', name: 'Érythrée', code: '+291', flag: '�🇷' },
  { iso2: 'ES', name: 'Espagne', code: '+34', flag: '🇪🇸' },
  { iso2: 'EE', name: 'Estonie', code: '+372', flag: '🇪🇪' },
  { iso2: 'US', name: 'États-Unis', code: '+1', flag: '🇺🇸' },
  { iso2: 'ET', name: 'Éthiopie', code: '+251', flag: '🇪🇹' },
  { iso2: 'FJ', name: 'Fidji', code: '+679', flag: '🇫🇯' },
  { iso2: 'FI', name: 'Finlande', code: '+358', flag: '🇫🇮' },
  { iso2: 'FR', name: 'France', code: '+33', flag: '🇫🇷' },
  { iso2: 'GA', name: 'Gabon', code: '+241', flag: '🇬🇦' },
  { iso2: 'GM', name: 'Gambie', code: '+220', flag: '🇬🇲' },
  { iso2: 'GE', name: 'Géorgie', code: '+995', flag: '🇬🇪' },
  { iso2: 'GH', name: 'Ghana', code: '+233', flag: '🇬🇭' },
  { iso2: 'GR', name: 'Grèce', code: '+30', flag: '🇬🇷' },
  { iso2: 'GT', name: 'Guatemala', code: '+502', flag: '🇬🇹' },
  { iso2: 'GN', name: 'Guinée', code: '+224', flag: '🇬🇳' },
  { iso2: 'GW', name: 'Guinée-Bissau', code: '+245', flag: '🇬�' },
  { iso2: 'GQ', name: 'Guinée équatoriale', code: '+240', flag: '🇬🇶' },
  { iso2: 'GY', name: 'Guyana', code: '+592', flag: '🇬🇾' },
  { iso2: 'HT', name: 'Haïti', code: '+509', flag: '🇭🇹' },
  { iso2: 'HN', name: 'Honduras', code: '+504', flag: '🇭🇳' },
  { iso2: 'HU', name: 'Hongrie', code: '+36', flag: '🇭🇺' },
  { iso2: 'IN', name: 'Inde', code: '+91', flag: '🇮🇳' },
  { iso2: 'ID', name: 'Indonésie', code: '+62', flag: '🇮🇩' },
  { iso2: 'IR', name: 'Iran', code: '+98', flag: '🇮🇷' },
  { iso2: 'IQ', name: 'Irak', code: '+964', flag: '🇮🇶' },
  { iso2: 'IE', name: 'Irlande', code: '+353', flag: '🇮🇪' },
  { iso2: 'IS', name: 'Islande', code: '+354', flag: '🇮🇸' },
  { iso2: 'IL', name: 'Israël', code: '+972', flag: '🇮🇱' },
  { iso2: 'IT', name: 'Italie', code: '+39', flag: '🇮🇹' },
  { iso2: 'JM', name: 'Jamaïque', code: '+1876', flag: '🇯🇲' },
  { iso2: 'JP', name: 'Japon', code: '+81', flag: '🇯🇵' },
  { iso2: 'JO', name: 'Jordanie', code: '+962', flag: '🇯🇴' },
  { iso2: 'KZ', name: 'Kazakhstan', code: '+7', flag: '🇰🇿' },
  { iso2: 'KE', name: 'Kenya', code: '+254', flag: '🇰🇪' },
  { iso2: 'KG', name: 'Kirghizistan', code: '+996', flag: '🇰�' },
  { iso2: 'KW', name: 'Koweït', code: '+965', flag: '🇰🇼' },
  { iso2: 'LA', name: 'Laos', code: '+856', flag: '🇱🇦' },
  { iso2: 'LS', name: 'Lesotho', code: '+266', flag: '🇱🇸' },
  { iso2: 'LV', name: 'Lettonie', code: '+371', flag: '🇱🇻' },
  { iso2: 'LB', name: 'Liban', code: '+961', flag: '��' },
  { iso2: 'LR', name: 'Libéria', code: '+231', flag: '🇱🇷' },
  { iso2: 'LY', name: 'Libye', code: '+218', flag: '🇱🇾' },
  { iso2: 'LI', name: 'Liechtenstein', code: '+423', flag: '�🇮' },
  { iso2: 'LT', name: 'Lituanie', code: '+370', flag: '🇱🇹' },
  { iso2: 'LU', name: 'Luxembourg', code: '+352', flag: '🇱🇺' },
  { iso2: 'MK', name: 'Macédoine du Nord', code: '+389', flag: '🇲🇰' },
  { iso2: 'MG', name: 'Madagascar', code: '+261', flag: '🇲🇬' },
  { iso2: 'MY', name: 'Malaisie', code: '+60', flag: '🇲🇾' },
  { iso2: 'MW', name: 'Malawi', code: '+265', flag: '🇲🇼' },
  { iso2: 'MV', name: 'Maldives', code: '+960', flag: '🇲🇻' },
  { iso2: 'ML', name: 'Mali', code: '+223', flag: '🇲🇱' },
  { iso2: 'MT', name: 'Malte', code: '+356', flag: '🇲🇹' },
  { iso2: 'MA', name: 'Maroc', code: '+212', flag: '🇲🇦' },
  { iso2: 'MR', name: 'Mauritanie', code: '+222', flag: '🇲🇷' },
  { iso2: 'MU', name: 'Maurice', code: '+230', flag: '🇲🇺' },
  { iso2: 'MX', name: 'Mexique', code: '+52', flag: '🇲🇽' },
  { iso2: 'MD', name: 'Moldavie', code: '+373', flag: '🇲🇩' },
  { iso2: 'MC', name: 'Monaco', code: '+377', flag: '🇲🇨' },
  { iso2: 'MN', name: 'Mongolie', code: '+976', flag: '🇲🇳' },
  { iso2: 'ME', name: 'Monténégro', code: '+382', flag: '🇲🇪' },
  { iso2: 'MZ', name: 'Mozambique', code: '+258', flag: '🇲🇿' },
  { iso2: 'MM', name: 'Myanmar', code: '+95', flag: '🇲🇲' },
  { iso2: 'NA', name: 'Namibie', code: '+264', flag: '🇳🇦' },
  { iso2: 'NR', name: 'Nauru', code: '+674', flag: '🇳🇷' },
  { iso2: 'NP', name: 'Népal', code: '+977', flag: '🇳🇵' },
  { iso2: 'NI', name: 'Nicaragua', code: '+505', flag: '🇳🇮' },
  { iso2: 'NE', name: 'Niger', code: '+227', flag: '🇳🇪' },
  { iso2: 'NG', name: 'Nigeria', code: '+234', flag: '🇳🇬' },
  { iso2: 'NO', name: 'Norvège', code: '+47', flag: '🇳🇴' },
  { iso2: 'NZ', name: 'Nouvelle-Zélande', code: '+64', flag: '🇳🇿' },
  { iso2: 'OM', name: 'Oman', code: '+968', flag: '🇴🇲' },
  { iso2: 'UG', name: 'Ouganda', code: '+256', flag: '🇺🇬' },
  { iso2: 'UZ', name: 'Ouzbékistan', code: '+998', flag: '🇺🇿' },
  { iso2: 'PK', name: 'Pakistan', code: '+92', flag: '🇵🇰' },
  { iso2: 'PW', name: 'Palaos', code: '+680', flag: '🇵🇼' },
  { iso2: 'PA', name: 'Panama', code: '+507', flag: '🇵🇦' },
  { iso2: 'PG', name: 'Papouasie-Nouvelle-Guinée', code: '+675', flag: '🇵🇬' },
  { iso2: 'PY', name: 'Paraguay', code: '+595', flag: '🇵🇾' },
  { iso2: 'NL', name: 'Pays-Bas', code: '+31', flag: '🇳🇱' },
  { iso2: 'PE', name: 'Pérou', code: '+51', flag: '🇵🇪' },
  { iso2: 'PH', name: 'Philippines', code: '+63', flag: '🇵🇭' },
  { iso2: 'PL', name: 'Pologne', code: '+48', flag: '🇵🇱' },
  { iso2: 'PT', name: 'Portugal', code: '+351', flag: '🇵🇹' },
  { iso2: 'QA', name: 'Qatar', code: '+974', flag: '🇶�' },
  { iso2: 'RO', name: 'Roumanie', code: '+40', flag: '🇷🇴' },
  { iso2: 'GB', name: 'Royaume-Uni', code: '+44', flag: '🇬🇧' },
  { iso2: 'RU', name: 'Russie', code: '+7', flag: '🇷🇺' },
  { iso2: 'RW', name: 'Rwanda', code: '+250', flag: '🇷🇼' },
  { iso2: 'SN', name: 'Sénégal', code: '+221', flag: '🇸🇳' },
  { iso2: 'RS', name: 'Serbie', code: '+381', flag: '🇷🇸' },
  { iso2: 'SC', name: 'Seychelles', code: '+248', flag: '🇸🇨' },
  { iso2: 'SL', name: 'Sierra Leone', code: '+232', flag: '🇸🇱' },
  { iso2: 'SG', name: 'Singapour', code: '+65', flag: '🇸🇬' },
  { iso2: 'SK', name: 'Slovaquie', code: '+421', flag: '🇸🇰' },
  { iso2: 'SI', name: 'Slovénie', code: '+386', flag: '🇸🇮' },
  { iso2: 'SO', name: 'Somalie', code: '+252', flag: '🇸🇴' },
  { iso2: 'SD', name: 'Soudan', code: '+249', flag: '🇸�🇩' },
  { iso2: 'SS', name: 'Soudan du Sud', code: '+211', flag: '🇸🇸' },
  { iso2: 'LK', name: 'Sri Lanka', code: '+94', flag: '🇱🇰' },
  { iso2: 'SE', name: 'Suède', code: '+46', flag: '🇸🇪' },
  { iso2: 'CH', name: 'Suisse', code: '+41', flag: '🇨🇭' },
  { iso2: 'SR', name: 'Suriname', code: '+597', flag: '🇸🇷' },
  { iso2: 'SZ', name: 'Eswatini', code: '+268', flag: '🇸🇿' },
  { iso2: 'SY', name: 'Syrie', code: '+963', flag: '🇸🇾' },
  { iso2: 'TJ', name: 'Tadjikistan', code: '+992', flag: '🇹🇯' },
  { iso2: 'TZ', name: 'Tanzanie', code: '+255', flag: '🇹🇿' },
  { iso2: 'TD', name: 'Tchad', code: '+235', flag: '🇹🇩' },
  { iso2: 'CZ', name: 'République Tchèque', code: '+420', flag: '🇨🇿' },
  { iso2: 'TH', name: 'Thaïlande', code: '+66', flag: '🇹🇭' },
  { iso2: 'TL', name: 'Timor Oriental', code: '+670', flag: '🇹🇱' },
  { iso2: 'TG', name: 'Togo', code: '+228', flag: '🇹🇬' },
  { iso2: 'TO', name: 'Tonga', code: '+676', flag: '🇹🇴' },
  { iso2: 'TT', name: 'Trinité-et-Tobago', code: '+1868', flag: '🇹🇹' },
  { iso2: 'TN', name: 'Tunisie', code: '+216', flag: '🇹🇳' },
  { iso2: 'TM', name: 'Turkménistan', code: '+993', flag: '🇹🇲' },
  { iso2: 'TR', name: 'Turquie', code: '+90', flag: '🇹🇷' },
  { iso2: 'TV', name: 'Tuvalu', code: '+688', flag: '🇹🇻' },
  { iso2: 'UA', name: 'Ukraine', code: '+380', flag: '🇺🇦' },
  { iso2: 'UY', name: 'Uruguay', code: '+598', flag: '🇺🇾' },
  { iso2: 'VU', name: 'Vanuatu', code: '+678', flag: '�🇺' },
  { iso2: 'VE', name: 'Venezuela', code: '+58', flag: '🇻🇪' },
  { iso2: 'VN', name: 'Vietnam', code: '+84', flag: '🇻�🇳' },
  { iso2: 'YE', name: 'Yémen', code: '+967', flag: '🇾🇪' },
  { iso2: 'ZM', name: 'Zambie', code: '+260', flag: '🇿🇲' },
  { iso2: 'ZW', name: 'Zimbabwe', code: '+263', flag: '🇿🇼' }
]

// State
const selectedCountry = ref<Country>(countries[0]) // France par défaut
const phoneNumber = ref('')
const isCountryDropdownOpen = ref(false)
const countrySearch = ref('')
const hasError = ref(false)
const errorMessage = ref('')

// Computed
const filteredCountries = computed(() => {
  if (!countrySearch.value) return countries
  const search = countrySearch.value.toLowerCase()
  return countries.filter(country => 
    country.name.toLowerCase().includes(search) ||
    country.code.includes(search) ||
    country.iso2.toLowerCase().includes(search)
  )
})

const phonePlaceholder = computed(() => {
  return `Numéro de téléphone ${selectedCountry.value.code}`
})

const phoneExample = computed(() => {
  try {
    const example = getExampleNumber(selectedCountry.value.iso2 as any, examples)
    return example ? example.formatNational() : ''
  } catch {
    return ''
  }
})

// Methods
const toggleCountryDropdown = () => {
  isCountryDropdownOpen.value = !isCountryDropdownOpen.value
  if (isCountryDropdownOpen.value) {
    countrySearch.value = ''
  }
}

const selectCountry = (country: Country) => {
  selectedCountry.value = country
  isCountryDropdownOpen.value = false
  countrySearch.value = ''
  validateAndFormat()
}

const validateAndFormat = () => {
  hasError.value = false
  errorMessage.value = ''
  
  if (!phoneNumber.value) {
    emit('update:modelValue', '')
    return
  }

  try {
    // Format le numéro pendant la saisie
    const formatted = formatIncompletePhoneNumber(phoneNumber.value, selectedCountry.value.iso2 as any)
    if (formatted !== phoneNumber.value) {
      phoneNumber.value = formatted
    }

    // Valide le numéro complet si possible
    if (phoneNumber.value.length > 6) {
      const parsed = parsePhoneNumber(phoneNumber.value, selectedCountry.value.iso2 as any)
      if (parsed && parsed.isValid()) {
        // Émet le numéro au format international
        emit('update:modelValue', parsed.number)
      } else {
        if (props.required) {
          hasError.value = true
          errorMessage.value = 'Format de numéro invalide'
        }
        emit('update:modelValue', selectedCountry.value.code + phoneNumber.value.replace(/\D/g, ''))
      }
    } else {
      // Pour les numéros courts, émet quand même une valeur
      emit('update:modelValue', selectedCountry.value.code + phoneNumber.value.replace(/\D/g, ''))
    }
  } catch (error) {
    if (props.required) {
      hasError.value = true
      errorMessage.value = 'Numéro de téléphone invalide'
    }
    // Fallback: combine code pays + numéro nettoyé
    emit('update:modelValue', selectedCountry.value.code + phoneNumber.value.replace(/\D/g, ''))
  }
}

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== phoneNumber.value) {
    try {
      const parsed = parsePhoneNumber(newValue || '')
      if (parsed) {
        // Trouve le pays correspondant
        const country = countries.find(c => c.iso2 === parsed.country)
        if (country) {
          selectedCountry.value = country
        }
        phoneNumber.value = parsed.nationalNumber
      } else {
        phoneNumber.value = newValue || ''
      }
    } catch {
      phoneNumber.value = newValue || ''
    }
  }
}, { immediate: true })

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.relative')) {
      isCountryDropdownOpen.value = false
    }
  })
})
</script>
