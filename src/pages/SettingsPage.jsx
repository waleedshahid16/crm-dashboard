import React, { useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Mail,
  Key,
  Camera,
  Save,
  ChevronRight,
  Users,
  Building2,
  Handshake,
  CheckSquare,
  TrendingUp,
  Download,
  Trash2,
  RefreshCw,
} from "lucide-react";

// Redux selectors and actions
import { selectTheme, setTheme } from "../store/slices/uiSlice";
import { selectTotalClients, selectActiveClients } from "../store/slices/clientsSlice";
import { selectAllCompanies } from "../store/slices/companiesSlice";
import { selectAllDeals } from "../store/slices/dealsSlice";
import { selectAllTasks } from "../store/slices/tasksSlice";

const SettingsPage = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const currentTheme = useSelector(selectTheme);
  const totalClients = useSelector(selectTotalClients);
  const activeClients = useSelector(selectActiveClients);
  const companies = useSelector(selectAllCompanies);
  const deals = useSelector(selectAllDeals);
  const tasks = useSelector(selectAllTasks);

  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    company: "ClientHub Inc.",
    role: "Administrator",
    timezone: "UTC-5 (Eastern Time)",
    language: "English",
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: false,
    dealAlerts: true,
    taskReminders: true,
    twoFactorAuth: false,
    sessionTimeout: "30",
  });

  // Memoized data statistics
  const dataStats = useMemo(() => {
    const activeCompanies = companies.filter(c => c.status === "Active").length;
    const wonDeals = deals.filter(d => d.status === "Closed Won" || d.status === "Won").length;
    const completedTasks = tasks.filter(t => t.status === "Completed").length;
    const totalDealValue = deals.reduce((sum, deal) => {
      const value = parseFloat(String(deal.dealValue || deal.value || "0").replace(/[^0-9.]/g, "")) || 0;
      return sum + value;
    }, 0);

    return {
      totalClients: totalClients.total,
      activeClients: activeClients.active,
      totalCompanies: companies.length,
      activeCompanies,
      totalDeals: deals.length,
      wonDeals,
      totalTasks: tasks.length,
      completedTasks,
      totalDealValue: `$${(totalDealValue / 1000).toFixed(1)}K`,
    };
  }, [totalClients, activeClients, companies, deals, tasks]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleThemeChange = useCallback((theme) => {
    dispatch(setTheme(theme));
  }, [dispatch]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  }, []);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "integrations", label: "Integrations", icon: Globe },
    { id: "data", label: "Data & Privacy", icon: Database },
  ];

  // Reusable Components
  const SettingSection = useCallback(({ title, description, children }) => (
    <div className="bg-[#FEFDFC] rounded-lg p-6 shadow-sm border border-[#BCC8BC] mb-4">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-[#2f362f]">{title}</h3>
        {description && (
          <p className="text-sm text-[#2f362f] opacity-70">{description}</p>
        )}
      </div>
      {children}
    </div>
  ), []);

  const Toggle = useCallback(({ name, checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3 border-b border-[#BCC8BC] last:border-b-0">
      <div>
        <p className="font-medium text-[#2f362f]">{label}</p>
        {description && (
          <p className="text-sm text-[#2f362f] opacity-70">{description}</p>
        )}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-[#BCC8BC] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
      </label>
    </div>
  ), []);

  const StatBadge = useCallback(({ icon: Icon, label, value, color }) => (
    <div className="flex items-center gap-3 p-3 bg-[#f8faf9] rounded-lg border border-[#BCC8BC]">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs text-[#2f362f] opacity-70">{label}</p>
        <p className="font-bold text-[#2f362f]">{value}</p>
      </div>
    </div>
  ), []);

  const renderProfileSettings = () => (
    <>
      <SettingSection
        title="Personal Information"
        description="Update your personal details and contact information"
      >
        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-[#BCC8BC]">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[#BCC8BC] flex items-center justify-center text-[#2f362f] font-bold text-3xl shadow-md">
              {formData.firstName.charAt(0)}
              {formData.lastName.charAt(0)}
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h4 className="font-bold text-[#2f362f] text-lg">
              {formData.firstName} {formData.lastName}
            </h4>
            <p className="text-[#2f362f] opacity-70">{formData.role}</p>
            <p className="text-sm text-[#2f362f] opacity-50">{formData.company}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#2f362f] mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-[#BCC8BC] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#f8faf9]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2f362f] mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-[#BCC8BC] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#f8faf9]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2f362f] mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-[#BCC8BC] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#f8faf9]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2f362f] mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-[#BCC8BC] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#f8faf9]"
            />
          </div>
        </div>
      </SettingSection>

      <SettingSection
        title="Organization"
        description="Your company and role information"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#2f362f] mb-2">
              Company
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-[#BCC8BC] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#f8faf9]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2f362f] mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-[#BCC8BC] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#f8faf9]"
            >
              <option>Administrator</option>
              <option>Manager</option>
              <option>Sales Rep</option>
              <option>Support Agent</option>
            </select>
          </div>
        </div>
      </SettingSection>

      <SettingSection
        title="Localization"
        description="Set your language and timezone preferences"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#2f362f] mb-2">
              <Globe className="w-4 h-4 inline mr-2" />
              Language
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-[#BCC8BC] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#f8faf9]"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2f362f] mb-2">
              Timezone
            </label>
            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-[#BCC8BC] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#f8faf9]"
            >
              <option>UTC-5 (Eastern Time)</option>
              <option>UTC-6 (Central Time)</option>
              <option>UTC-7 (Mountain Time)</option>
              <option>UTC-8 (Pacific Time)</option>
              <option>UTC+0 (GMT)</option>
              <option>UTC+1 (Central European)</option>
              <option>UTC+5 (Pakistan Standard Time)</option>
            </select>
          </div>
        </div>
      </SettingSection>
    </>
  );

  const renderNotificationSettings = () => (
    <>
      <SettingSection
        title="Email Notifications"
        description="Manage your email notification preferences"
      >
        <Toggle
          name="emailNotifications"
          checked={formData.emailNotifications}
          onChange={handleInputChange}
          label="Email Notifications"
          description="Receive email notifications for important updates"
        />
        <Toggle
          name="weeklyDigest"
          checked={formData.weeklyDigest}
          onChange={handleInputChange}
          label="Weekly Digest"
          description="Get a weekly summary of your activity"
        />
      </SettingSection>

      <SettingSection
        title="Push Notifications"
        description="Control in-app and browser push notifications"
      >
        <Toggle
          name="pushNotifications"
          checked={formData.pushNotifications}
          onChange={handleInputChange}
          label="Push Notifications"
          description="Enable browser push notifications"
        />
        <Toggle
          name="dealAlerts"
          checked={formData.dealAlerts}
          onChange={handleInputChange}
          label="Deal Alerts"
          description="Get notified when deals change status"
        />
        <Toggle
          name="taskReminders"
          checked={formData.taskReminders}
          onChange={handleInputChange}
          label="Task Reminders"
          description="Receive reminders for upcoming and overdue tasks"
        />
      </SettingSection>

      {/* Live Stats Preview */}
      <SettingSection
        title="Notification Statistics"
        description="Overview of your CRM data that triggers notifications"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatBadge
            icon={Handshake}
            label="Active Deals"
            value={dataStats.totalDeals - dataStats.wonDeals}
            color="bg-blue-100 text-blue-600"
          />
          <StatBadge
            icon={CheckSquare}
            label="Pending Tasks"
            value={dataStats.totalTasks - dataStats.completedTasks}
            color="bg-orange-100 text-orange-600"
          />
          <StatBadge
            icon={Users}
            label="Active Clients"
            value={dataStats.activeClients}
            color="bg-green-100 text-green-600"
          />
          <StatBadge
            icon={Building2}
            label="Companies"
            value={dataStats.totalCompanies}
            color="bg-purple-100 text-purple-600"
          />
        </div>
      </SettingSection>
    </>
  );

  const renderSecuritySettings = () => (
    <>
      <SettingSection
        title="Password"
        description="Update your password regularly to keep your account secure"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2f362f] mb-2">
              <Key className="w-4 h-4 inline mr-2" />
              Current Password
            </label>
            <input
              type="password"
              placeholder="Enter current password"
              className="w-full px-4 py-2.5 border border-[#BCC8BC] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#f8faf9]"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2f362f] mb-2">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full px-4 py-2.5 border border-[#BCC8BC] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#f8faf9]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2f362f] mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full px-4 py-2.5 border border-[#BCC8BC] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#f8faf9]"
              />
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-200 text-[#2f362f] rounded-md font-semibold hover:bg-blue-300 transition-colors">
            Update Password
          </button>
        </div>
      </SettingSection>

      <SettingSection
        title="Two-Factor Authentication"
        description="Add an extra layer of security to your account"
      >
        <Toggle
          name="twoFactorAuth"
          checked={formData.twoFactorAuth}
          onChange={handleInputChange}
          label="Enable 2FA"
          description="Require a verification code when signing in"
        />
        {formData.twoFactorAuth && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-700 font-medium">
              ✓ Two-factor authentication is enabled
            </p>
          </div>
        )}
      </SettingSection>

      <SettingSection
        title="Session Settings"
        description="Control your session preferences"
      >
        <div>
          <label className="block text-sm font-medium text-[#2f362f] mb-2">
            Session Timeout (minutes)
          </label>
          <select
            name="sessionTimeout"
            value={formData.sessionTimeout}
            onChange={handleInputChange}
            className="w-full max-w-xs px-4 py-2.5 border border-[#BCC8BC] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#f8faf9]"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
          </select>
        </div>
      </SettingSection>
    </>
  );

  const renderAppearanceSettings = () => (
    <>
      <SettingSection
        title="Theme"
        description="Customize the look and feel of your dashboard"
      >
        <div className="grid grid-cols-3 gap-4">
          {["light", "dark", "system"].map((theme) => (
            <button
              key={theme}
              onClick={() => handleThemeChange(theme)}
              className={`p-4 rounded-lg border-2 transition-all ${
                currentTheme === theme
                  ? "border-blue-500 bg-blue-50"
                  : "border-[#BCC8BC] hover:border-blue-300"
              }`}
            >
              <div
                className={`w-full h-16 rounded mb-3 ${
                  theme === "light"
                    ? "bg-white border border-gray-200"
                    : theme === "dark"
                    ? "bg-gray-800"
                    : "bg-gradient-to-r from-white to-gray-800"
                }`}
              />
              <p className="text-sm font-medium text-[#2f362f] capitalize">
                {theme}
              </p>
              {currentTheme === theme && (
                <span className="text-xs text-blue-600 font-medium">Active</span>
              )}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-[#2f362f] opacity-70">
          Current theme: <span className="font-medium capitalize">{currentTheme}</span>
        </p>
      </SettingSection>

      <SettingSection
        title="Display Density"
        description="Choose how compact you want the interface to be"
      >
        <div className="flex gap-4">
          {["Comfortable", "Compact", "Spacious"].map((density) => (
            <button
              key={density}
              className="px-4 py-2 rounded-md border border-[#BCC8BC] hover:border-blue-300 hover:bg-blue-50 transition-all text-[#2f362f] font-medium"
            >
              {density}
            </button>
          ))}
        </div>
      </SettingSection>

      <SettingSection
        title="Sidebar Preferences"
        description="Customize sidebar behavior"
      >
        <div className="space-y-3">
          <Toggle
            name="sidebarCollapsed"
            checked={false}
            onChange={() => {}}
            label="Collapse sidebar by default"
            description="Start with a minimized sidebar on page load"
          />
          <Toggle
            name="showLabels"
            checked={true}
            onChange={() => {}}
            label="Show icon labels"
            description="Display text labels next to sidebar icons"
          />
        </div>
      </SettingSection>
    </>
  );

  const renderIntegrationSettings = () => (
    <>
      <SettingSection
        title="Connected Apps"
        description="Manage your third-party integrations"
      >
        <div className="space-y-4">
          {[
            { name: "Google Calendar", status: "Connected", icon: "📅" },
            { name: "Slack", status: "Not connected", icon: "💬" },
            { name: "Zapier", status: "Connected", icon: "⚡" },
            { name: "Mailchimp", status: "Not connected", icon: "📧" },
          ].map((app) => (
            <div
              key={app.name}
              className="flex items-center justify-between p-4 bg-[#f8faf9] rounded-lg border border-[#BCC8BC]"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{app.icon}</span>
                <div>
                  <p className="font-medium text-[#2f362f]">{app.name}</p>
                  <p className="text-sm text-[#2f362f] opacity-70">{app.status}</p>
                </div>
              </div>
              <button
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  app.status === "Connected"
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-blue-200 text-[#2f362f] hover:bg-blue-300"
                }`}
              >
                {app.status === "Connected" ? "Disconnect" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </SettingSection>

      <SettingSection title="API Access" description="Manage your API keys">
        <div className="p-4 bg-[#f8faf9] rounded-lg border border-[#BCC8BC]">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#2f362f]">API Key</p>
              <p className="text-sm text-[#2f362f] opacity-70 font-mono">
                ••••••••••••••••
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-[#FEFDFC] border border-[#BCC8BC] rounded-md text-sm font-medium text-[#2f362f] hover:bg-gray-50 transition-colors">
                Show
              </button>
              <button className="px-3 py-1.5 bg-[#FEFDFC] border border-[#BCC8BC] rounded-md text-sm font-medium text-[#2f362f] hover:bg-gray-50 transition-colors flex items-center gap-1">
                <RefreshCw className="w-3 h-3" />
                Regenerate
              </button>
            </div>
          </div>
        </div>
      </SettingSection>
    </>
  );

  const renderDataSettings = () => (
    <>
      {/* Data Overview - Connected to Redux */}
      <SettingSection
        title="Data Overview"
        description="Summary of your CRM data"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#2f362f]">{dataStats.totalClients}</p>
            <p className="text-sm text-[#2f362f] opacity-70">Total Clients</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 text-center">
            <Building2 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#2f362f]">{dataStats.totalCompanies}</p>
            <p className="text-sm text-[#2f362f] opacity-70">Companies</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
            <Handshake className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#2f362f]">{dataStats.totalDeals}</p>
            <p className="text-sm text-[#2f362f] opacity-70">Total Deals</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 text-center">
            <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#2f362f]">{dataStats.totalDealValue}</p>
            <p className="text-sm text-[#2f362f] opacity-70">Deal Value</p>
          </div>
        </div>
        <div className="p-3 bg-[#f8faf9] rounded-lg border border-[#BCC8BC]">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#2f362f]">
              <CheckSquare className="w-4 h-4 inline mr-2" />
              Tasks: {dataStats.completedTasks} / {dataStats.totalTasks} completed
            </span>
            <span className="text-[#2f362f]">
              Won Deals: {dataStats.wonDeals} / {dataStats.totalDeals}
            </span>
          </div>
        </div>
      </SettingSection>

      <SettingSection
        title="Data Export"
        description="Download your data in various formats"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { type: "Clients", count: dataStats.totalClients, icon: Users },
            { type: "Deals", count: dataStats.totalDeals, icon: Handshake },
            { type: "Tasks", count: dataStats.totalTasks, icon: CheckSquare },
          ].map(({ type, count, icon: Icon }) => (
            <button
              key={type}
              className="p-4 bg-[#f8faf9] rounded-lg border border-[#BCC8BC] hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5 text-[#2f362f] opacity-70" />
                <Download className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="font-medium text-[#2f362f]">Export {type}</p>
              <p className="text-sm text-[#2f362f] opacity-70">
                {count} records • CSV, Excel, JSON
              </p>
            </button>
          ))}
        </div>
      </SettingSection>

      <SettingSection
        title="Data Retention"
        description="Configure how long we keep your data"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#f8faf9] rounded-lg border border-[#BCC8BC]">
            <div>
              <p className="font-medium text-[#2f362f]">Activity Logs</p>
              <p className="text-sm text-[#2f362f] opacity-70">
                How long to keep activity history
              </p>
            </div>
            <select className="px-4 py-2 border border-[#BCC8BC] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#FEFDFC]">
              <option>30 days</option>
              <option>90 days</option>
              <option>1 year</option>
              <option>Forever</option>
            </select>
          </div>
        </div>
      </SettingSection>

      <SettingSection
        title="Danger Zone"
        description="Irreversible actions that affect your account"
      >
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-700">Delete Account</p>
              <p className="text-sm text-red-600">
                Permanently delete your account and all {dataStats.totalClients} clients, {dataStats.totalDeals} deals, and {dataStats.totalTasks} tasks
              </p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </div>
      </SettingSection>
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileSettings();
      case "notifications":
        return renderNotificationSettings();
      case "security":
        return renderSecuritySettings();
      case "appearance":
        return renderAppearanceSettings();
      case "integrations":
        return renderIntegrationSettings();
      case "data":
        return renderDataSettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto bg-[#f8faf9] min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[#2f362f] mb-3">
          <span>Dashboard</span>
          <span>/</span>
          <span className="text-[#2f362f] font-medium">Settings</span>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[#2f362f] mb-2 tracking-tight">
              Settings
            </h1>
            <p className="text-[#2f362f] text-lg">
              Manage your account settings and preferences
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2.5 bg-blue-200 text-[#2f362f] rounded-md font-semibold flex items-center gap-2 hover:bg-blue-300 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-[#FEFDFC] rounded-lg shadow-sm border border-[#BCC8BC] overflow-hidden sticky top-4">
            <nav className="divide-y divide-[#BCC8BC]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#788978] text-white"
                      : "text-[#2f362f] hover:bg-[#f8faf9]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 ${
                      activeTab === tab.id ? "text-white" : "text-[#BCC8BC]"
                    }`}
                  />
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">{renderContent()}</div>
      </div>
    </div>
  );
};

export default SettingsPage;
