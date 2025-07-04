'use client'

import { cn } from "@/lib/utils";

interface SubmissionCalendarProps {
  className?: string;
}

const SubmissionCalendar = ({ className }: SubmissionCalendarProps) => {
  // Generate mock submission data for the past year
  const generateSubmissionData = () => {
    const data: { [key: string]: number } = {};
    const today = new Date();
    
    // Generate data for the past 365 days
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Random submission count (0-8 submissions per day)
      const submissions = Math.random() > 0.3 ? Math.floor(Math.random() * 8) : 0;
      if (submissions > 0) {
        data[dateStr] = submissions;
      }
    }
    
    return data;
  };

  const submissionData = generateSubmissionData();

  // Get intensity level based on submission count
  const getIntensityLevel = (count: number) => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    if (count <= 6) return 3;
    return 4;
  };

  // Get color class based on intensity
  const getColorClass = (level: number) => {
    switch (level) {
      case 0: return "bg-gray-100 border-gray-200";
      case 1: return "bg-green-200 border-green-300";
      case 2: return "bg-green-300 border-green-400";
      case 3: return "bg-green-500 border-green-600";
      case 4: return "bg-green-700 border-green-800";
      default: return "bg-gray-100 border-gray-200";
    }
  };

  // Generate calendar grid for the past year
  const generateCalendarGrid = () => {
    const weeks = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);
    
    // Find the start of the week (Sunday)
    const startOfWeek = new Date(startDate);
    startOfWeek.setDate(startDate.getDate() - startDate.getDay());
    
    const currentDate = new Date(startOfWeek);
    
    // Generate 53 weeks
    for (let week = 0; week < 53; week++) {
      const weekDays = [];
      
      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const submissionCount = submissionData[dateStr] || 0;
        const intensityLevel = getIntensityLevel(submissionCount);
        const colorClass = getColorClass(intensityLevel);
        
        // Only show squares for the past year
        const isInRange = currentDate >= startDate && currentDate <= today;
        
        weekDays.push({
          date: new Date(currentDate),
          dateStr,
          submissionCount,
          intensityLevel,
          colorClass,
          isInRange
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      weeks.push(weekDays);
    }
    
    return weeks;
  };

  const calendarGrid = generateCalendarGrid();
  const totalSubmissions = Object.values(submissionData).reduce((sum, count) => sum + count, 0);
  const activeDays = Object.keys(submissionData).length;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Activity Heatmap */}
      <div className="space-y-4">
        
        {/* Month labels */}
        <div className="flex text-xs text-gray-500 mb-2">
          <div className="w-8"></div>
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
            <div key={month} className="flex-1 text-center" style={{ marginLeft: index === 0 ? '0' : '8px' }}>
              {month}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col text-xs text-gray-500 justify-between py-1">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          
          {/* Calendar squares */}
          <div className="flex gap-1">
            {calendarGrid.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={cn(
                      "w-3 h-3 rounded-sm border transition-colors cursor-pointer",
                      day.isInRange ? day.colorClass : "bg-gray-50 border-gray-100",
                      "hover:ring-2 hover:ring-gray-300"
                    )}
                    title={day.isInRange ? `${day.dateStr}: ${day.submissionCount} submissions` : ''}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={cn("w-3 h-3 rounded-sm border", getColorClass(level))}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default SubmissionCalendar;
