import { useState, useEffect } from 'react'

export default function Documentation() {
  const [showOpenApi, setShowOpenApi] = useState(false)
  const [openApiSpec, setOpenApiSpec] = useState<string>('')

  useEffect(() => {
    fetch('/openapi.json')
      .then(res => res.json())
      .then(data => setOpenApiSpec(JSON.stringify(data, null, 2)))
      .catch(() => setOpenApiSpec('Failed to load OpenAPI spec'))
  }, [])
  const useCases = [
    {
      id: 1,
      name: 'Animal Profile & Reproductive Status',
      coverage: 95,
      status: 'Fully Supported',
      description: 'View animal details, breed, lactation number, milking/dry status, pregnancy status',
      apis: ['GetAnimalDetailsByTagNo', 'GetFarmerDetailsByMobile'],
    },
    {
      id: 2,
      name: 'Breeding & Heat Detection',
      coverage: 80,
      status: 'Mostly Supported',
      description: 'Last AI date, PD status, calving history. Heat detection requires calculation from AI dates.',
      apis: ['GetAnimalDetailsByTagNo (lastBreedingActivity)'],
    },
    {
      id: 3,
      name: 'Health Issue & Symptom Triage',
      coverage: 40,
      status: 'Partial',
      description: 'lastHealthActivity field available but often null. Symptom triage requires LLM reasoning.',
      apis: ['GetAnimalDetailsByTagNo (lastHealthActivity)'],
    },
    {
      id: 4,
      name: 'Milk Yield Drop & Lactation Support',
      coverage: 90,
      status: 'Fully Supported',
      description: 'Lactation number, milking stage, avgMilkPerDayInLiter available.',
      apis: ['GetAnimalDetailsByTagNo', 'GetFarmerDetailsByMobile'],
    },
    {
      id: 5,
      name: 'Starting a New Cattle Farm',
      coverage: 0,
      status: 'Knowledge-Only',
      description: 'No API data needed - uses LLM knowledge for guidance on breeds, housing, etc.',
      apis: ['None - LLM knowledge'],
    },
    {
      id: 6,
      name: 'Improving Profitability, FAT %, Health',
      coverage: 75,
      status: 'Mostly Supported',
      description: 'Milk collection data from Amul APIs, animal health from PashuGPT. FAT % analysis available.',
      apis: ['GetFarmerDetail', 'GetSocietyData', 'GetAnimalDetailsByTagNo'],
    },
  ]

  const apis = [
    {
      name: 'Amul OTP APIs',
      auth: 'OTP-based authentication',
      endpoints: [
        { name: 'GetAPIUrl', desc: 'Get API configuration' },
        { name: 'ValidateMobileNo', desc: 'Send OTP' },
        { name: 'RegisterMobileNo', desc: 'Verify OTP & get token' },
        { name: 'GetFarmerDetail', desc: 'Farmer profile & milk data' },
        { name: 'GetSocietyData', desc: 'Society/cooperative info' },
        { name: 'GetFarmerSetting', desc: 'App settings' },
      ],
    },
    {
      name: 'PashuGPT APIs',
      auth: 'Bearer Token (server-side)',
      endpoints: [
        { name: 'GetFarmerDetailsByMobile', desc: 'Farmer + animal counts' },
        { name: 'GetAnimalDetailsByTagNo', desc: 'Full animal profile with breeding history' },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-2">API Coverage Documentation</h1>
        <p className="text-neutral-500 mb-8">Use case feasibility analysis for Amul dairy farming chatbot</p>

        {/* Overall Coverage */}
        <div className="border border-neutral-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-black">Overall Coverage Summary</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="border border-neutral-200 p-4 rounded-lg">
              <div className="text-3xl font-bold text-black">~75%</div>
              <div className="text-sm text-neutral-500">Average Coverage</div>
            </div>
            <div className="border border-neutral-200 p-4 rounded-lg">
              <div className="text-3xl font-bold text-black">6</div>
              <div className="text-sm text-neutral-500">Use Cases Analyzed</div>
            </div>
            <div className="border border-neutral-200 p-4 rounded-lg">
              <div className="text-3xl font-bold text-black">8</div>
              <div className="text-sm text-neutral-500">APIs Available</div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="border border-neutral-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-black">Use Case Coverage</h2>
          <div className="space-y-4">
            {useCases.map((uc) => (
              <div key={uc.id} className="border border-neutral-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-black">
                      UC{uc.id}: {uc.name}
                    </h3>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs mt-1 border ${
                        uc.status === 'Fully Supported'
                          ? 'border-black bg-black text-white'
                          : uc.status === 'Mostly Supported'
                          ? 'border-neutral-400 bg-neutral-100 text-neutral-700'
                          : uc.status === 'Partial'
                          ? 'border-neutral-300 bg-neutral-50 text-neutral-600'
                          : 'border-neutral-200 bg-white text-neutral-500'
                      }`}
                    >
                      {uc.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-black">{uc.coverage}%</div>
                  </div>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2 mb-2">
                  <div
                    className="h-2 rounded-full bg-black"
                    style={{ width: `${uc.coverage}%` }}
                  />
                </div>
                <p className="text-sm text-neutral-600 mb-2">{uc.description}</p>
                <div className="text-xs text-neutral-500">
                  <strong>APIs:</strong> {uc.apis.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Reference */}
        <div className="border border-neutral-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-black">API Reference</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {apis.map((api) => (
              <div key={api.name} className="border border-neutral-200 rounded-lg p-4">
                <h3 className="font-semibold text-black mb-1">{api.name}</h3>
                <p className="text-xs text-neutral-500 mb-3">{api.auth}</p>
                <ul className="space-y-2">
                  {api.endpoints.map((ep) => (
                    <li key={ep.name} className="text-sm">
                      <code className="bg-neutral-100 border border-neutral-200 px-2 py-1 rounded text-black font-mono text-xs">{ep.name}</code>
                      <span className="text-neutral-600 ml-2">- {ep.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* OpenAPI Spec */}
        <div className="border border-neutral-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-black">OpenAPI Specification</h2>
            <div className="flex gap-2">
              <a
                href="/openapi.json"
                download="amul-pashugpt-openapi.json"
                className="border border-black px-4 py-2 rounded-lg text-sm hover:bg-black hover:text-white transition-colors"
              >
                Download JSON
              </a>
              <button
                onClick={() => setShowOpenApi(!showOpenApi)}
                className="border border-black px-4 py-2 rounded-lg text-sm hover:bg-black hover:text-white transition-colors"
              >
                {showOpenApi ? 'Hide' : 'View'} Spec
              </button>
            </div>
          </div>
          {showOpenApi && (
            <pre className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 text-xs font-mono overflow-auto max-h-96 text-black">
              {openApiSpec}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}
