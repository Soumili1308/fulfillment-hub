import React from "react";
import {
  Settings as SettingsIcon,
  Database,
  RotateCcw,
  ShieldCheck,
  Info,
} from "lucide-react";

import { resetFulfillmentData } from "../utils/storage";

function Settings() {
  return (
    <div className="settings-page">
      <div className="section-heading">
        <div>
          <h2>Settings</h2>
          <p>Manage your Fulfillment Hub demo environment.</p>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-header">
          <div className="settings-card-icon"><SettingsIcon size={20} /></div>
          <div>
            <h3>Application</h3>
            <p>Fulfillment Hub configuration</p>
          </div>
        </div>

        <div className="settings-info-row">
          <span>Application Name</span>
          <strong>Fulfillment Hub</strong>
        </div>
        <div className="settings-info-row">
          <span>Organization</span>
          <strong>XYZ Operations</strong>
        </div>
        <div className="settings-info-row">
          <span>Environment</span>
          <strong>Demo</strong>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-header">
          <div className="settings-card-icon blue"><Database size={20} /></div>
          <div>
            <h3>Demo Data</h3>
            <p>Manage locally stored operational records</p>
          </div>
        </div>

        <div className="settings-description">
          <Info size={17} />
          <p>
            Changes are saved in this browser using localStorage. Resetting restores
            the original sample orders, inventory, shipments, and issues.
          </p>
        </div>

        <div className="settings-reset-row">
          <div>
            <strong>Reset Sample Data</strong>
            <span>Restore the original demo records.</span>
          </div>
          <button
            type="button"
            className="reset-demo-button"
            onClick={resetFulfillmentData}
          >
            <RotateCcw size={15} /> Reset Demo
          </button>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-header">
          <div className="settings-card-icon green"><ShieldCheck size={20} /></div>
          <div>
            <h3>Data & Privacy</h3>
            <p>Local prototype information</p>
          </div>
        </div>

        <p className="settings-privacy-text">
          This demonstration uses sample records stored locally in your browser.
          It does not connect to a real warehouse, payment gateway, or courier API.
        </p>
      </div>
    </div>
  );
}

export default Settings;
