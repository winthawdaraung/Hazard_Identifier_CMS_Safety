import React from 'react';

const ActivityForm = ({ formData, updateFormData }) => {
  const handleChange = (field, value) => {
    updateFormData(field, value);
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="form-label">Building Number and Zone *</label>
          <input
            type="text"
            className="form-input"
            value={formData.buildingLocation}
            onChange={(e) => handleChange('buildingLocation', e.target.value)}
            placeholder="e.g., Building 32"
          />
        </div>
        <div>
          <label className="form-label">Location Details</label>
          <input
            type="text"
            className="form-input"
            value={formData.locationDetails}
            onChange={(e) => handleChange('locationDetails', e.target.value)}
            placeholder="e.g., 32/4-B09 Office"
          />
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