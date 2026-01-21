import { useState, useEffect } from 'react'
import type { AuthState } from '../types'
import {
  authenticatedRequest,
  getPashuGPTFarmerByMobile,
  getPashuGPTAnimalByTag,
} from '../api'
import Documentation from './Documentation'

interface Props {
  auth: AuthState
  onLogout: () => void
  onLoginClick?: () => void
}

interface ApiData {
  [key: string]: any
}

export default function Dashboard({ auth, onLogout, onLoginClick }: Props) {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'amul' | 'pashugpt' | 'docs'>('docs')

  // Amul API Data
  const [amulData, setAmulData] = useState<ApiData>({})

  // PashuGPT Data
  const [pashuGptData, setPashuGptData] = useState<ApiData>({})
  const [tagNumber, setTagNumber] = useState('106290093933')

  // Fetch Amul APIs
  const fetchAmulData = async () => {
    setLoading(true)
    const data: ApiData = {}

    const endpoints = [
      { name: 'GetFarmerDetail', endpoint: 'GetFarmerDetail' },
      { name: 'GetSocietyData', endpoint: 'GetSocietyData' },
      { name: 'GetFarmerSetting', endpoint: 'GetFarmerSetting' },
      { name: 'GetAppModuleList', endpoint: 'GetAppModuleList' },
      { name: 'GetVersionDetail', endpoint: 'GetVersionDetail' },
    ]

    for (const { name, endpoint } of endpoints) {
      try {
        const response = await authenticatedRequest(
          auth.baseUrl,
          endpoint,
          auth.bearerToken,
          auth.deviceId
        )
        data[name] = response
      } catch (err) {
        data[name] = { error: (err as Error).message }
      }
    }

    setAmulData(data)
    setLoading(false)
  }

  // Fetch PashuGPT APIs
  const fetchPashuGptData = async () => {
    setLoading(true)
    const data: ApiData = {}

    try {
      data.FarmerByMobile = await getPashuGPTFarmerByMobile(auth.mobileNumber)
    } catch (err) {
      data.FarmerByMobile = { error: (err as Error).message }
    }

    if (tagNumber) {
      try {
        data.AnimalByTag = await getPashuGPTAnimalByTag(tagNumber)
      } catch (err) {
        data.AnimalByTag = { error: (err as Error).message }
      }
    }

    setPashuGptData(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchAmulData()
    fetchPashuGptData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-black text-white px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Amul API Dashboard</h1>
            <p className="text-neutral-400 text-sm">
              {auth.isAuthenticated ? `Logged in as: ${auth.mobileNumber}` : 'Public Access - PashuGPT & Docs available'}
            </p>
          </div>
          {auth.isAuthenticated ? (
            <button
              onClick={onLogout}
              className="border border-white hover:bg-white hover:text-black px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              className="border border-white hover:bg-white hover:text-black px-4 py-2 rounded-lg transition-colors"
            >
              Login with OTP
            </button>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-neutral-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'docs'
                ? 'text-black border-b-2 border-black'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            API Coverage
          </button>
          <button
            onClick={() => setActiveTab('pashugpt')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'pashugpt'
                ? 'text-black border-b-2 border-black'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            PashuGPT APIs
          </button>
          <button
            onClick={() => setActiveTab('amul')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'amul'
                ? 'text-black border-b-2 border-black'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            Amul APIs (Auth)
          </button>
        </div>
      </div>

      {/* Documentation Tab - Full Width */}
      {activeTab === 'docs' && <Documentation />}

      {/* Content - Only for amul and pashugpt tabs */}
      {activeTab !== 'docs' && (
      <div className="flex min-h-[calc(100vh-140px)]">
        {/* Left Panel - UI Cards */}
        <div className="w-1/2 p-6 overflow-auto border-r">
          {activeTab === 'amul' ? (
            auth.isAuthenticated ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Amul Data (Authenticated)</h2>
                <button
                  onClick={fetchAmulData}
                  disabled={loading}
                  className="border border-black text-black px-4 py-2 rounded hover:bg-black hover:text-white disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {/* Farmer Card */}
              {amulData.GetFarmerDetail?.Data && (
                <div className="border border-neutral-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-lg mb-2">Farmer Profile</h3>
                  {Array.isArray(amulData.GetFarmerDetail.Data) ? (
                    amulData.GetFarmerDetail.Data.map((farmer: any, idx: number) => (
                      <div key={idx} className="border-b border-neutral-100 pb-2 mb-2 last:border-0">
                        <p className="font-medium">{farmer.FarmerName}</p>
                        <p className="text-sm text-neutral-600">Farmer ID: {farmer.FarmerId}</p>
                        <p className="text-sm text-neutral-600">Code: {farmer.FarmerCode}</p>
                        {farmer.BankName && <p className="text-sm text-neutral-600">Bank: {farmer.BankName}</p>}
                        {farmer.BankAccountNo && <p className="text-sm text-neutral-600">Account: {farmer.BankAccountNo}</p>}
                      </div>
                    ))
                  ) : (
                    <p>No farmer data</p>
                  )}
                </div>
              )}

              {/* Society Card */}
              {amulData.GetSocietyData?.Data && (
                <div className="border border-neutral-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-lg mb-2">Society Info</h3>
                  <p className="font-medium">{amulData.GetSocietyData.Data.SocietyName}</p>
                  <p className="text-sm text-neutral-600">Society Code: {amulData.GetSocietyData.Data.SocietyCode}</p>
                  <p className="text-sm text-neutral-600">Society ID: {amulData.GetSocietyData.Data.SocietyId}</p>
                  <p className="text-sm text-neutral-600">Union: {amulData.GetSocietyData.Data.UnionName} ({amulData.GetSocietyData.Data.UnionCode})</p>
                </div>
              )}

              {/* Settings Card */}
              {amulData.GetFarmerSetting?.Data && (
                <div className="border border-neutral-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-lg mb-2">Settings</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Array.isArray(amulData.GetFarmerSetting.Data) &&
                      amulData.GetFarmerSetting.Data.map((setting: any, idx: number) => (
                        <div key={idx} className="flex justify-between border border-neutral-100 p-2 rounded">
                          <span className="text-neutral-600">{setting.SettingKey}</span>
                          <span className={setting.SettingValue === 'true' ? 'text-black font-medium' : 'text-neutral-400'}>
                            {setting.SettingValue}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64">
                <h2 className="text-xl font-semibold mb-4">Login Required</h2>
                <p className="text-neutral-600 mb-4">Amul APIs require OTP authentication</p>
                <button
                  onClick={onLoginClick}
                  className="border border-black px-6 py-3 rounded-lg hover:bg-black hover:text-white transition-colors"
                >
                  Login with OTP
                </button>
              </div>
            )
          ) : (
            auth.isAuthenticated ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">PashuGPT Data</h2>
                <button
                  onClick={fetchPashuGptData}
                  disabled={loading}
                  className="border border-black text-black px-4 py-2 rounded hover:bg-black hover:text-white disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {/* Tag Input */}
              <div className="bg-white rounded-lg shadow p-4 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Animal Tag Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagNumber}
                    onChange={(e) => setTagNumber(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg"
                    placeholder="Enter tag number"
                  />
                  <button
                    onClick={fetchPashuGptData}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Fetch
                  </button>
                </div>
              </div>

              {/* Farmer Card */}
              {pashuGptData.FarmerByMobile && Array.isArray(pashuGptData.FarmerByMobile) && (
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                  <h3 className="font-semibold text-lg mb-2">Farmers (PashuGPT)</h3>
                  {pashuGptData.FarmerByMobile.map((farmer: any, idx: number) => (
                    <div key={idx} className="border-b pb-2 mb-2 last:border-0">
                      <p className="font-medium">{farmer.farmerName}</p>
                      <p className="text-sm text-gray-600">Code: {farmer.farmerCode}</p>
                      <p className="text-sm text-gray-600">Society: {farmer.societyName}</p>
                      <p className="text-sm text-gray-600">
                        Location: {farmer.village}, {farmer.subDistrict}, {farmer.district}
                      </p>
                      <div className="flex gap-4 mt-1">
                        <span className="text-sm bg-blue-100 px-2 py-1 rounded">
                          Cows: {farmer.cow}
                        </span>
                        <span className="text-sm bg-purple-100 px-2 py-1 rounded">
                          Buffalo: {farmer.buffalo}
                        </span>
                        <span className="text-sm bg-green-100 px-2 py-1 rounded">
                          Milking: {farmer.totalMilkingAnimals}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Animal Card */}
              {pashuGptData.AnimalByTag && !pashuGptData.AnimalByTag.error && (
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                  <h3 className="font-semibold text-lg mb-2">Animal Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Tag Number</p>
                      <p className="font-medium">{pashuGptData.AnimalByTag.tagNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium">{pashuGptData.AnimalByTag.animalType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Breed</p>
                      <p className="font-medium">{pashuGptData.AnimalByTag.breed}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Lactation #</p>
                      <p className="font-medium">{pashuGptData.AnimalByTag.lactationNo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Milking Stage</p>
                      <p className={`font-medium ${pashuGptData.AnimalByTag.milkingStage === 'Milking' ? 'text-green-600' : 'text-orange-600'}`}>
                        {pashuGptData.AnimalByTag.milkingStage}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pregnancy</p>
                      <p className={`font-medium ${pashuGptData.AnimalByTag.pregnancyStage === 'Pregnant' ? 'text-pink-600' : 'text-gray-600'}`}>
                        {pashuGptData.AnimalByTag.pregnancyStage}
                      </p>
                    </div>
                  </div>

                  {/* Breeding Activity */}
                  {pashuGptData.AnimalByTag.lastBreedingActivity && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium mb-2">Breeding Activity</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-blue-50 p-2 rounded">
                          <span className="text-gray-500">Last AI:</span>{' '}
                          <span className="font-medium">
                            {pashuGptData.AnimalByTag.lastBreedingActivity.lastAI
                              ? new Date(pashuGptData.AnimalByTag.lastBreedingActivity.lastAI).toLocaleDateString()
                              : 'N/A'}
                          </span>
                        </div>
                        <div className="bg-purple-50 p-2 rounded">
                          <span className="text-gray-500">Last PD:</span>{' '}
                          <span className="font-medium">
                            {pashuGptData.AnimalByTag.lastBreedingActivity.lastPD
                              ? new Date(pashuGptData.AnimalByTag.lastBreedingActivity.lastPD).toLocaleDateString()
                              : 'N/A'}
                          </span>
                        </div>
                        <div className="bg-green-50 p-2 rounded">
                          <span className="text-gray-500">Last Calving:</span>{' '}
                          <span className="font-medium">
                            {pashuGptData.AnimalByTag.lastBreedingActivity.lastCalving
                              ? new Date(pashuGptData.AnimalByTag.lastBreedingActivity.lastCalving).toLocaleDateString()
                              : 'N/A'}
                          </span>
                        </div>
                        <div className="bg-yellow-50 p-2 rounded">
                          <span className="text-gray-500">Calves:</span>{' '}
                          <span className="font-medium">
                            M: {pashuGptData.AnimalByTag.lastBreedingActivity.calfMale}, F: {pashuGptData.AnimalByTag.lastBreedingActivity.calfFemale}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64">
                <h2 className="text-xl font-semibold mb-4">Login Required</h2>
                <p className="text-neutral-600 mb-4">PashuGPT APIs require authentication</p>
                <button
                  onClick={onLoginClick}
                  className="border border-black px-6 py-3 rounded-lg hover:bg-black hover:text-white transition-colors"
                >
                  Login with OTP
                </button>
              </div>
            )
          )}
        </div>

        {/* Right Panel - Raw JSON */}
        <div className="w-1/2 p-6 bg-black overflow-auto">
          <h2 className="text-lg font-semibold text-white mb-4">Raw JSON Responses</h2>

          {activeTab === 'amul' ? (
            Object.entries(amulData).map(([key, value]) => (
              <div key={key} className="mb-4">
                <h3 className="text-green-400 font-mono mb-1">{key}</h3>
                <pre className="text-gray-300 text-xs font-mono bg-gray-800 p-3 rounded overflow-auto max-h-64">
                  {JSON.stringify(value, null, 2)}
                </pre>
              </div>
            ))
          ) : (
            Object.entries(pashuGptData).map(([key, value]) => (
              <div key={key} className="mb-4">
                <h3 className="text-green-400 font-mono mb-1">{key}</h3>
                <pre className="text-gray-300 text-xs font-mono bg-gray-800 p-3 rounded overflow-auto max-h-64">
                  {JSON.stringify(value, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>
      </div>
      )}
    </div>
  )
}
