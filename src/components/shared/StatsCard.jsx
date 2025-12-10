import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const StatsCard = ({
  title,
  number,
  icon: Icon,
  color = "blue",
  trend,
  subtitle,
}) => {
  const colorClasses = {
    blue: { bg: "bg-blue-50", text: "text-blue-600" },
    green: { bg: "bg-green-50", text: "text-green-600" },
    purple: { bg: "bg-purple-50", text: "text-purple-600" },
    orange: { bg: "bg-orange-50", text: "text-orange-600" },
  };

  const colors = colorClasses[color] || colorClasses.blue;
  const isPositive = trend > 0;

  return (
    <div className="bg-[#FEFDFC] rounded-lg p-3 sm:p-5 border border-[#BCC8BC] transition-all duration-300">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className={`p-1.5 sm:p-2 rounded-lg ${colors.bg}`}>
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.text}`} />
        </div>
        {trend !== undefined && (
          <span
            className={`flex items-center gap-0.5 text-xs sm:text-sm font-medium ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {isPositive ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>
      <h3 className="text-lg sm:text-2xl font-bold text-[#2f362f] mb-0.5">{number}</h3>
      <p className="text-xs sm:text-sm text-[#2f362f]">{title}</p>
      {subtitle && (
        <p className="text-[10px] sm:text-xs text-[#2f362f]/70 mt-0.5 hidden sm:block">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatsCard;
