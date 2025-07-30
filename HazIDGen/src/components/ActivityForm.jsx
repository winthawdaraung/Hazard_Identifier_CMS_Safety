import React, { useState, useEffect } from 'react';
import { getUniqueBuildings, getRoomsForBuilding } from '../utils/hazardLoader';

const ActivityForm = ({ formData, updateFormData, buildingRoomData }) => {
  const [buildings, setBuildings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showBuildingDropdown, setShowBuildingDropdown] = useState(false);
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);

  useEffect(() => {
    console.log('Building room data received:', buildingRoomData);
    if (buildingRoomData && buildingRoomData.length > 0) {
      console.log('Processing building room data:', buildingRoomData);
      const uniqueBuildings = getUniqueBuildings(buildingRoomData);
      console.log('Unique buildings:', uniqueBuildings);
      setBuildings(uniqueBuildings);
    } else {
      console.log('No building room data available');
      setBuildings([]);
    }
  }, [buildingRoomData]);

  useEffect(() => {
    if (formData.buildingLocation && buildingRoomData) {
      console.log('Getting rooms for building:', formData.buildingLocation);
      const buildingRooms = getRoomsForBuilding(buildingRoomData, formData.buildingLocation);
      console.log('Rooms for building:', buildingRooms);
      setRooms(buildingRooms);
    }
  }, [formData.buildingLocation, buildingRoomData]);

  const handleChange = (field, value) => {
    updateFormData(field, value);
  };

  const handleBuildingChange = (value) => {
    console.log('Building selected:', value);
    handleChange('buildingLocation', value);
    handleChange('locationDetails', ''); // Clear room when building changes
    setShowBuildingDropdown(false);
  };

  const handleRoomChange = (value) => {
    console.log('Room selected:', value);
    handleChange('locationDetails', value);
    setShowRoomDropdown(false);
  };

  const locationOptions = ['Meyrin', 'Prevessin', 'Point 5'];

  return (
    <div className="form-section">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Activity Summary Information</h2>
      
      {/* Title */}
      <div className="mb-4">
        <label className="form-label">Activity Title *</label>
        <input
          type="text"
          className="form-input"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter the name of the specific activity"
        />
      </div>

      {/* Creator Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="form-label">Creator Name *</label>
          <input
            type="text"
            className="form-input"
            value={formData.creatorName}
            onChange={(e) => handleChange('creatorName', e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="form-label">Creator Department *</label>
          <input
            type="text"
            className="form-input"
            value={formData.creatorDepartment}
            onChange={(e) => handleChange('creatorDepartment', e.target.value)}
            placeholder="e.g., EP-CMX-SCI"
          />
        </div>
      </div>

      {/* Personnel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="form-label">Activity Responsible Person *</label>
          <input
            type="text"
            className="form-input"
            value={formData.responsiblePerson}
            onChange={(e) => handleChange('responsiblePerson', e.target.value)}
            placeholder="Name of the person leading activity"
          />
        </div>
        <div>
          <label className="form-label">Estimated Number of Participants</label>
          <input
            type="number"
            className="form-input"
            value={formData.participantCount}
            onChange={(e) => handleChange('participantCount', e.target.value)}
            placeholder="Number of people performing the activity"
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="form-label">Start Date *</label>
          <input
            type="date"
            className="form-input"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">Estimated End Date</label>
          <input
            type="date"
            className="form-input"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
          />
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="form-label">Location *</label>
          <select
            className="form-input"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
          >
            <option value="">Select location</option>
            {locationOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="relative">
          <label className="form-label">Building Number and Zone *</label>
          <input
            type="text"
            className="form-input"
            value={formData.buildingLocation}
            onChange={(e) => handleChange('buildingLocation', e.target.value)}
                         onFocus={() => {
               console.log('Building input focused, showing dropdown');
               setShowBuildingDropdown(true);
             }}
             onBlur={() => {
               console.log('Building input blurred, hiding dropdown');
               setTimeout(() => setShowBuildingDropdown(false), 200);
             }}
            placeholder="e.g., Building 32"
          />
                     {showBuildingDropdown && buildings.length > 0 && (
             <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
               <div className="p-2 text-sm text-gray-500 border-b">Available buildings ({buildings.length}):</div>
               {buildings.map(building => (
                 <div
                   key={building}
                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                   onClick={() => handleBuildingChange(building)}
                 >
                   {building}
                 </div>
               ))}
             </div>
           )}
           {showBuildingDropdown && buildings.length === 0 && (
             <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4 text-center text-gray-500">
               No buildings available
             </div>
           )}
        </div>
        <div className="relative">
          <label className="form-label">Room/Area</label>
          <input
            type="text"
            className="form-input"
            value={formData.locationDetails}
            onChange={(e) => handleChange('locationDetails', e.target.value)}
                         onFocus={() => {
               console.log('Room input focused, showing dropdown');
               setShowRoomDropdown(true);
             }}
             onBlur={() => {
               console.log('Room input blurred, hiding dropdown');
               setTimeout(() => setShowRoomDropdown(false), 200);
             }}
            placeholder="e.g., 32/4-B09"
            disabled={!formData.buildingLocation}
          />
                     {showRoomDropdown && rooms.length > 0 && formData.buildingLocation && (
             <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
               <div className="p-2 text-sm text-gray-500 border-b">Available rooms ({rooms.length}):</div>
               {rooms.map(room => (
                 <div
                   key={room}
                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                   onClick={() => handleRoomChange(room)}
                 >
                   {room}
                 </div>
               ))}
             </div>
           )}
           {showRoomDropdown && rooms.length === 0 && formData.buildingLocation && (
             <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4 text-center text-gray-500">
               No rooms available for this building
             </div>
           )}
        </div>
      </div>

      {/* Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="form-label">CERN Specific Support (Group)</label>
          <input
            type="text"
            className="form-input"
            value={formData.cernSupport}
            onChange={(e) => handleChange('cernSupport', e.target.value)}
            placeholder="e.g., EN-HE, EN-EL, EN-AA, EN-CV"
          />
        </div>
        <div>
          <label className="form-label">CMS Specific Support (Team)</label>
          <input
            type="text"
            className="form-input"
            value={formData.cmsSupport}
            onChange={(e) => handleChange('cmsSupport', e.target.value)}
            placeholder="e.g., CMS TC technicians, CMS electricians"
          />
        </div>
      </div>

      {/* Documents */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Existing Documents</h3>
        
        <div className="space-y-4">
          <div>
            <label className="form-label">Safety File</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={formData.safetyDocuments}
              onChange={(e) => handleChange('safetyDocuments', e.target.value)}
              placeholder="Risk assessments, certificates, training records, VICs, etc."
            />
          </div>
          
          <div>
            <label className="form-label">Technical Documents</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={formData.technicalDocuments}
              onChange={(e) => handleChange('technicalDocuments', e.target.value)}
              placeholder="Technical documents for tooling/equipment used, subdetectors/parts, etc."
            />
          </div>
          
          <div>
            <label className="form-label">Other Useful Documents</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={formData.otherDocuments}
              onChange={(e) => handleChange('otherDocuments', e.target.value)}
              placeholder="Procedures, instructions, task sheets, maintenances, etc."
            />
          </div>
        </div>
      </div>

      {/* HSE Link */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Link with HSE (including HSE-RP)</h3>
        
        <div className="space-y-4">
          <div>
            <label className="form-label">Support by HSE on Existing Subject</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={formData.hseSupport}
              onChange={(e) => handleChange('hseSupport', e.target.value)}
              placeholder="HSE-RP, HSE inspections, etc."
            />
          </div>
          
          <div>
            <label className="form-label">Reference Documents (if any)</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={formData.referenceDocuments}
              onChange={(e) => handleChange('referenceDocuments', e.target.value)}
              placeholder="Additional supporting documentation from HSE: reports, derogation requests, advice, etc."
            />
          </div>
        </div>
      </div>

      {/* Activity Description */}
      <div className="mb-4">
        <label className="form-label">Description of the Activity *</label>
        <textarea
          className="form-textarea"
          rows={6}
          value={formData.activityDescription}
          onChange={(e) => handleChange('activityDescription', e.target.value)}
          placeholder="Further details about the activity. Please detail:
• The scope of the activity
• Operating procedure (Step by Step description)
• Who, what, when, where, how
• Tools/equipment used
• If multiple teams intervening, which tasks are performed by which team
• Any other relevant info"
        />
        <p className="text-sm text-gray-600 mt-2">
          <strong>Tip:</strong> Consider reviewing the HSE Guideline for detailed examples of hazardous events and controls.
        </p>
      </div>
    </div>
  );
};

export default ActivityForm;