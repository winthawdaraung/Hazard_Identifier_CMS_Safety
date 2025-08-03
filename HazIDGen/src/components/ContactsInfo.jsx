import React, { useState, useEffect } from 'react';
import { ExternalLink, Mail, Globe, AlertTriangle } from 'lucide-react';
import { loadContactData } from '../utils/hazardLoader';

const ContactsInfo = ({ formData }) => {
  const [contactData, setContactData] = useState({
    webContacts: [],
    emailContacts: [],
    isUsingFallback: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const data = await loadContactData();
        setContactData(data);
      } catch (error) {
        console.error('Error loading contacts:', error);
        // Keep the default empty arrays if loading fails
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, []);

  const openLink = (url) => {
    if (window.electronAPI) {
      window.electronAPI.openExternal(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const getCompletionStatus = () => {
    const required = [
      formData.title,
      formData.creatorName,
      formData.creatorDepartment,
      formData.responsiblePerson,
      formData.startDate,
      formData.building,  // Fixed: use 'building' instead of 'buildingLocation'
      formData.activityDescription
    ];
    
    const completed = required.filter(field => field && field.trim()).length;
    return {
      completed,
      total: required.length,
      percentage: Math.round((completed / required.length) * 100)
    };
  };

  const status = getCompletionStatus();
  const isComplete = status.percentage === 100;

  return (
    <div className="space-y-6">
      {/* Completion Status */}
      <div className="form-section">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Document Status & Review</h2>
        
        <div className="bg-white border rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">Completion Status</h3>
            <div className="flex items-center space-x-2">
              {isComplete ? (
                <div className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  Ready to Export
                </div>
              ) : (
                <div className="flex items-center text-amber-600">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Missing Required Fields
                </div>
              )}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className={`h-2 rounded-full transition-all ${
                isComplete ? 'bg-green-500' : 'bg-amber-500'
              }`}
              style={{ width: `${status.percentage}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-gray-600">
            {status.completed} of {status.total} required fields completed ({status.percentage}%)
          </p>
          
          {!isComplete && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded">
              <p className="text-sm text-amber-800">
                Please complete all required fields before exporting the document.
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-gray-50 border rounded-lg p-6">
          <h4 className="font-medium text-gray-800 mb-4">Document Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Activity:</span>
              <span className="ml-2 font-medium">{formData.title || 'Not specified'}</span>
            </div>
            <div>
              <span className="text-gray-600">Creator:</span>
              <span className="ml-2 font-medium">
                {formData.creatorName && formData.creatorDepartment 
                  ? `${formData.creatorName} (${formData.creatorDepartment})`
                  : 'Not specified'
                }
              </span>
            </div>
            <div>
              <span className="text-gray-600">Location:</span>
              <span className="ml-2 font-medium">
                {formData.building && formData.room 
                  ? `${formData.building}/${formData.room}` 
                  : formData.building || 'Not specified'
                }
              </span>
            </div>
            <div>
              <span className="text-gray-600">Hazards Selected:</span>
              <span className="ml-2 font-medium">{formData.selectedHazards?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contacts and Useful Links */}
      <div className="form-section">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Contacts and Useful Links</h2>
        
        {/* Error Warning for Fallback Data */}
        {contactData.isUsingFallback && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <div>
                <h4 className="font-medium text-amber-800">Using Fallback Contact Data</h4>
                <p className="text-sm text-amber-700">
                  Could not load contact information from Excel file. Please check that the Excel file is accessible and contains "Web Contacts" and "Email Contacts" sheets.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Website Links */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Useful Links
          </h3>
          {loading ? (
            <div className="text-center py-4">
              <p className="text-gray-600">Loading contacts...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactData.webContacts.map((contact, index) => (
                <div key={index} className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                  contactData.isUsingFallback ? 'border-amber-200 bg-amber-50' : 'border-gray-200'
                }`}>
                  <button
                    onClick={() => openLink(contact.url)}
                    className="flex items-start space-x-3 w-full text-left"
                  >
                    <ExternalLink className="w-4 h-4 text-cern-blue mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-cern-blue hover:underline">{contact.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{contact.description}</p>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Email Contacts */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Email Contacts
          </h3>
          {loading ? (
            <div className="text-center py-4">
              <p className="text-gray-600">Loading email contacts...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {contactData.emailContacts.map((contact, index) => (
                <div key={index} className={`border rounded-lg p-4 ${
                  contactData.isUsingFallback ? 'border-amber-200 bg-amber-50' : 'border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-cern-blue" />
                    <div>
                      <button
                        onClick={() => openLink(`mailto:${contact.email}`)}
                        className="font-medium text-cern-blue hover:underline"
                      >
                        {contact.email}
                      </button>
                      <p className="text-sm text-gray-600">{contact.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Guidelines */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">HSE Guidelines</h4>
          <p className="text-sm text-blue-700 mb-2">
            For detailed hazard analysis, consider reviewing the HSE Guideline document which contains:
          </p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Examples of causes of potential hazardous events</li>
            <li>• Hazardous events and consequences</li>
            <li>• Reference preventing and protective controls</li>
          </ul>
          <button
            onClick={() => openLink('https://edms.cern.ch/document/1114042')}
            className="mt-3 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
          >
            View HSE Guideline
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactsInfo;