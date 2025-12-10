/* eslint-disable react-hooks/static-components */
/* eslint-disable no-unused-vars */
import React, { useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  FileText,
  Users,
  Briefcase,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Selectors
const selectAllClients = (state) => state?.clients?.clients || [];
const selectAllCompanies = (state) => state?.companies?.companies || [];
const selectAllDeals = (state) => state?.deals?.deals || [];
const selectAllTasks = (state) => state?.tasks?.tasks || [];

const ReportsPage = () => {
  // Navigation
  const navigate = useNavigate();
  
  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Chart responsive settings
  const chartHeight = isMobile ? 250 : 300;
  const barSize = isMobile ? 20 : 30;
  const pieOuterRadius = isMobile ? 80 : 100;
  const xAxisAngle = isMobile ? -90 : -45;
  
  // Get data from Redux
  const clients = useSelector(selectAllClients);
  const companies = useSelector(selectAllCompanies);
  const deals = useSelector(selectAllDeals);
  const tasks = useSelector(selectAllTasks);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const activeClients = clients.filter((c) => c.status === "Active").length;
    const activeDeals = deals.filter((d) => d.status === "Active").length;
    const wonDeals = deals.filter((d) => d.status === "Won").length;
    const lostDeals = deals.filter((d) => d.status === "Lost").length;
    const inProgressTasks = tasks.filter(
      (t) => t.status === "In Progress"
    ).length;
    const completedTasks = tasks.filter((t) => t.status === "Completed").length;

    const totalDealValue = deals
      .filter((d) => d.status === "Active" || d.status === "Won")
      .reduce((sum, deal) => {
        const value = parseInt(deal.value?.replace(/[^0-9]/g, "") || "0");
        return sum + value;
      }, 0);

    const winRate = deals.length > 0 ? (wonDeals / deals.length) * 100 : 0;
    const taskCompletionRate =
      tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    return {
      activeClients,
      totalClients: clients.length,
      activeDeals,
      wonDeals,
      lostDeals,
      totalDeals: deals.length,
      inProgressTasks,
      completedTasks,
      totalTasks: tasks.length,
      totalDealValue: `$${(totalDealValue / 1000).toFixed(1)}K`,
      winRate: winRate.toFixed(1),
      taskCompletionRate: taskCompletionRate.toFixed(1),
    };
  }, [clients, deals, tasks]);

  // Prepare data for charts
  const dealsByStage = useMemo(() => {
    const stages = [
      "Discovery",
      "Qualification",
      "Proposal",
      "Negotiation",
      "Closed Won",
      "Closed Lost",
    ];

    if (!deals || deals.length === 0) {
      return stages.map((stage) => ({ name: stage, count: 0 }));
    }

    return stages.map((stage) => ({
      name: stage,
      count: deals.filter((d) => d.status === stage).length,
    }));
  }, [deals]);

  const dealsByStatus = useMemo(() => {
    if (!deals || deals.length === 0) return [];

    const statusGroups = deals.reduce((acc, deal) => {
      const status = deal.status || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusGroups).map(([name, value]) => ({
      name,
      value,
    }));
  }, [deals]);

  // Updated tasksByStatus to match TasksPage statuses: Active, On Hold, Completed, Cancelled
  const tasksByStatus = useMemo(() => {
    const statuses = ["Active", "On Hold", "Completed", "Cancelled"];

    if (!tasks || tasks.length === 0) {
      return statuses.map((status) => ({ name: status, count: 0 }));
    }

    return statuses.map((status) => ({
      name: status,
      count: tasks.filter((t) => t.status === status).length,
    }));
  }, [tasks]);

  // Chart colors
  const COLORS = {
    primary: ["#667eea", "#764ba2", "#f093fb", "#4facfe"],
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#3b82f6",
    // Task status colors matching TasksPage
    taskStatus: {
      Active: "#3b82f6", // Blue
      "On Hold": "#f59e0b", // Yellow
      Completed: "#10b981", // Green
      Cancelled: "#ef4444", // Red
    },
  };

  // Helper component for summary cards
  const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => {
    const colorClasses = {
      blue: { bg: "bg-blue-50", text: "text-blue-600" },
      green: { bg: "bg-green-50", text: "text-green-600" },
      purple: { bg: "bg-purple-50", text: "text-purple-600" },
      orange: { bg: "bg-orange-50", text: "text-orange-600" },
    };

    const colors = colorClasses[color] || colorClasses.blue;

    return (
      <div className="bg-[#FEFDFC] rounded-lg p-3 sm:p-5 shadow-sm border border-[#BCC8BC]">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className={`p-1.5 sm:p-2 rounded-lg ${colors.bg}`}>
            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.text}`} />
          </div>
          {trend && (
            <span
              className={`text-xs sm:text-sm font-medium ${
                trend > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend > 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
        </div>
        <h3 className="text-lg sm:text-2xl font-bold text-[#2f362f] mb-0.5">{value}</h3>
        <p className="text-xs sm:text-sm text-[#2f362f]">{title}</p>
        {subtitle && <p className="text-[10px] sm:text-xs text-[#2f362f]/70 mt-0.5 hidden sm:block">{subtitle}</p>}
      </div>
    );
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-[#2f362f] mb-2 sm:mb-3">
          <button 
            onClick={() => navigate('/')}
            className="hover:text-[#2f362f]/60 transition-colors"
          >
            Dashboard
          </button>
          <span>/</span>
          <span className="text-[#2f362f] font-medium">Reports</span>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2f362f] mb-1 sm:mb-2">
              Business Reports
            </h1>
            <p className="text-sm sm:text-base text-[#2f362f]">
              Overview of your business performance
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-200 text-[#2f362f] rounded-md transition-colors font-semibold text-sm">
              Export PDF
            </button>
            <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 border border-[#BCC8BC] rounded-md transition-colors text-sm">
              <span className="flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Generate</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
        <StatCard
          title="Total Revenue"
          value={summary.totalDealValue}
          icon={DollarSign}
          color="green"
          trend={5.2}
          subtitle="From active and won deals"
        />
        <StatCard
          title="Active Clients"
          value={`${summary.activeClients} / ${summary.totalClients}`}
          icon={Users}
          color="blue"
          trend={12.5}
          subtitle="Active out of total"
        />
        <StatCard
          title="Deal Win Rate"
          value={`${summary.winRate}%`}
          icon={TrendingUp}
          color="purple"
          trend={3.8}
          subtitle="Success rate of deals"
        />
        <StatCard
          title="Tasks Completed"
          value={`${summary.completedTasks} / ${summary.totalTasks}`}
          icon={CheckCircle}
          color="orange"
          trend={8.1}
          subtitle="Completed out of total"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-8">
        {/* Deals by Stage */}
        <div className="bg-[#FEFDFC] rounded-lg p-4 sm:p-6 shadow-sm border border-[#BCC8BC]">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#2f362f]">
                Deals by Stage
              </h3>
              <p className="text-xs sm:text-sm text-[#2f362f]">
                Current pipeline distribution
              </p>
            </div>
            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div style={{ height: isMobile ? '280px' : '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={dealsByStage}
                margin={{
                  top: 10,
                  right: 10,
                  left: isMobile ? -15 : 0,
                  bottom: isMobile ? 60 : 20
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: isMobile ? 9 : 11, fill: '#4a5568' }}
                  angle={-45}
                  textAnchor="end"
                  height={isMobile ? 70 : 50}
                  interval={0}
                  tickMargin={5}
                />
                <YAxis 
                  tick={{ fontSize: isMobile ? 10 : 12, fill: '#4a5568' }} 
                  width={isMobile ? 25 : 35}
                  tickCount={5}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    fontSize: '12px',
                    padding: '8px 12px'
                  }}
                  formatter={(value) => [`${value} Deals`, 'Count']}
                />
                <Bar
                  dataKey="count"
                  radius={[4, 4, 0, 0]}
                  name="Deals"
                  barSize={isMobile ? 18 : 28}
                >
                  {dealsByStage.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS.primary[index % COLORS.primary.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deals by Status */}
        <div className="bg-[#FEFDFC] rounded-lg p-4 sm:p-6 shadow-sm border border-[#BCC8BC]">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#2f362f]">
                Deals by Status
              </h3>
              <p className="text-xs sm:text-sm text-[#2f362f]">
                Status distribution of all deals
              </p>
            </div>
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          </div>
          <div style={{ height: isMobile ? '280px' : '320px' }}>
            {dealsByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dealsByStatus}
                    cx="50%"
                    cy={isMobile ? "40%" : "45%"}
                    labelLine={false}
                    outerRadius={isMobile ? 70 : 90}
                    innerRadius={isMobile ? 35 : 45}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {dealsByStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.name === "Won" || entry.name === "Closed Won"
                            ? COLORS.success
                            : entry.name === "Active"
                            ? COLORS.info
                            : entry.name === "Lost" || entry.name === "Closed Lost"
                            ? COLORS.danger
                            : COLORS.primary[index % COLORS.primary.length]
                        }
                        stroke="#fff"
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} Deals`, name]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      fontSize: '12px',
                      padding: '8px 12px'
                    }}
                  />
                  <Legend 
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{
                      paddingTop: '10px',
                      fontSize: isMobile ? '10px' : '12px'
                    }}
                    iconSize={isMobile ? 8 : 10}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[#2f362f]">
                No deal data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tasks Overview and Recent Activity in a row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-8">
        {/* Tasks Overview */}
        <div className="bg-[#FEFDFC] rounded-lg p-4 sm:p-6 shadow-sm border border-[#BCC8BC] h-full">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#2f362f]">Tasks Overview</h3>
              <p className="text-xs sm:text-sm text-[#2f362f]">
                Distribution of tasks by status
              </p>
            </div>
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div style={{ height: isMobile ? '250px' : '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={tasksByStatus}
                margin={{
                  top: 10,
                  right: 10,
                  left: isMobile ? -15 : 0,
                  bottom: 5
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: isMobile ? 10 : 12, fill: '#4a5568' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: isMobile ? 10 : 12, fill: '#4a5568' }}
                  width={isMobile ? 25 : 35}
                  tickCount={5}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    fontSize: '12px',
                    padding: '8px 12px'
                  }}
                  formatter={(value) => [`${value} Tasks`, 'Count']}
                />
                <Bar
                  dataKey="count"
                  radius={[4, 4, 0, 0]}
                  name="Tasks"
                  barSize={isMobile ? 30 : 40}
                >
                  {tasksByStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORS.taskStatus[entry.name] ||
                        COLORS.primary[index % COLORS.primary.length]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#FEFDFC] rounded-lg p-4 sm:p-6 shadow-sm border border-[#BCC8BC] h-full">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#2f362f]">
                Recent Activity
              </h3>
              <p className="text-xs sm:text-sm text-[#2f362f]">
                Latest updates across the system
              </p>
            </div>
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#2f362f]" />
          </div>
          <div className="space-y-2 sm:space-y-3 max-h-[280px] overflow-y-auto">
            {[...deals, ...tasks, ...clients].slice(0, 5).map((item, index) => (
              <div
                key={index}
                className="flex items-start p-2 sm:p-3 rounded-lg transition-colors hover:bg-gray-50 border border-transparent hover:border-gray-200"
              >
                <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg mr-2 sm:mr-3 flex-shrink-0 border border-blue-100">
                  {item.dealName ? (
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  ) : item.title ? (
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  ) : (
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-medium text-[#2f362f] truncate">
                    {item.dealName || item.title || item.name || "New item"}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#2f362f]/70 truncate">
                    {item.status && `${item.status}`}
                    {item.dealValue && ` • ${item.dealValue}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
