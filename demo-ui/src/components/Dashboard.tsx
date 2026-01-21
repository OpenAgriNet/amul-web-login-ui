import { useState, useEffect } from 'react'
import { AuthState } from '../App'
import {
  authenticatedRequest,
  getPashuGPTFarmerByMobile,
  getPashuGPTAnimalByTag,
  generateDeviceId,
} from '../api'

interface Props {
  auth: AuthState
  onLogout: () => void
}

interface ApiData {
  [key: string]: any
}

export default function Dashboard({ auth, onLogout }: Props) {
  const [loading, setLoading] = useState(false)
  const [deviceId] = useState(generateDeviceId())
  const [activeTab, setActiveTab] = useState<'amul' | 'pashugpt'>('amul')

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
          deviceId
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

  const JsonCard = ({ title, data }: { title: string; data: any }) => (
    <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b">
        <h3 className="font-semibold text-gray-700">{title}</h3>
      </div>
      <pre className="p-4 text-sm overflow-auto max-h-64 bg-gray-50 text-gray-800">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white px-6 py-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Amul API Dashboard</h1>
            <p className="text-blue-200 text-sm">Logged in as: {auth.mobileNumber}</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab('amul')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'amul'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Amul APIs (OTP Auth)
          </button>
          <button
            onClick={() => setActiveTab('pashugpt')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'pashugpt'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            PashuGPT APIs (No Auth)
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex min-h-[calc(100vh-140px)]">
        {/* Left Panel - UI Cards */}
        <div className="w-1/2 p-6 overflow-auto border-r">
          {activeTab === 'amul' ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Amul Data (Authenticated)</h2>
                <button
                  onClick={fetchAmulData}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {/* Farmer Card */}
              {amulData.GetFarmerDetail?.Data && (
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                  <h3 className="font-semibold text-lg mb-2">Farmer Profile</h3>
                  {Array.isArray(amulData.GetFarmerDetail.Data) ? (
                    amulData.GetFarmerDetail.Data.map((farmer: any, idx: number) => (
                      <div key={idx} className="border-b pb-2 mb-2 last:border-0">
                        <p className="font-medium">{farmer.FarmerName}</p>
                        <p className="text-sm text-gray-600">Code: {farmer.FarmerCode}</p>
                        <p className="text-sm text-gray-600">Society: {farmer.SocietyName}</p>
                        <p className="text-sm text-gray-600">Mobile: {farmer.MobileNo}</p>
                      </div>
                    ))
                  ) : (
                    <p>No farmer data</p>
                  )}
                </div>
              )}

              {/* Society Card */}
              {amulData.GetSocietyData?.Data && (
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                  <h3 className="font-semibold text-lg mb-2">Society Info</h3>
                  <p className="font-medium">{amulData.GetSocietyData.Data.SocietyName}</p>
                  <p className="text-sm text-gray-600">Code: {amulData.GetSocietyData.Data.SocietyCode}</p>
                  <p className="text-sm text-gray-600">Union: {amulData.GetSocietyData.Data.UnionName}</p>
                  <p className="text-sm text-gray-600">
                    Address: {amulData.GetSocietyData.Data.VillageName}, {amulData.GetSocietyData.Data.TalukaName}, {amulData.GetSocietyData.Data.DistrictName}
                  </p>
                </div>
              )}

              {/* Settings Card */}
              {amulData.GetFarmerSetting?.Data && (
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                  <h3 className="font-semibold text-lg mb-2">Settings</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Array.isArray(amulData.GetFarmerSetting.Data) &&
                      amulData.GetFarmerSetting.Data.map((setting: any, idx: number) => (
                        <div key={idx} className="flex justify-between bg-gray-50 p-2 rounded">
                          <span>{setting.SettingName}</span>
                          <span className={setting.SettingValue === 'true' ? 'text-green-600' : 'text-gray-500'}>
                            {setting.SettingValue}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">PashuGPT Data</h2>
                <button
                  onClick={fetchPashuGptData}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
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
          )}
        </div>

        {/* Right Panel - Raw JSON */}
        <div className="w-1/2 p-6 bg-gray-900 overflow-auto">
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
    </div>
  )
}
