import { useState, useEffect, useRef } from 'react';

interface DatePickerProps {
  value: string;
  onChange: (dateString: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
}

const DatePicker = ({ value, onChange, placeholder = "Select date", label, id }: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Parse initial value (DD/MM/YYYY format)
  useEffect(() => {
    if (value && value.includes('/')) {
      const [day, month, year] = value.split('/').map(Number);
      const dateObj = new Date(year, month - 1, day);

      if (!isNaN(dateObj.getTime())) {
        setSelectedDate(dateObj);
        setMonth(dateObj.getMonth());
        setYear(dateObj.getFullYear());
      }
    }
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const daysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(year, month, day);
    setSelectedDate(newDate);

    // Format date as DD/MM/YYYY
    const formattedDate = `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`;
    onChange(formattedDate);
    setIsOpen(false);
  };

  const renderCalendar = () => {
    const days = daysInMonth(month, year);
    const firstDay = firstDayOfMonth(month, year);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    // Create array for calendar days
    let calendarDays = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    // Add days of month
    for (let i = 1; i <= days; i++) {
      const currentDate = new Date(year, month, i);
      const isSelected = selectedDate &&
        currentDate.getDate() === selectedDate.getDate() &&
        currentDate.getMonth() === selectedDate.getMonth() &&
        currentDate.getFullYear() === selectedDate.getFullYear();

      calendarDays.push(
        <div
          key={`day-${i}`}
          onClick={() => handleDateSelect(i)}
          className={`
            h-8 w-8 flex items-center justify-center rounded-full cursor-pointer
            hover:bg-primary hover:text-primary-content transition-colors
            ${isSelected ? 'bg-primary text-primary-content' : ''}
          `}
        >
          {i}
        </div>
      );
    }

    return (
      <div className="p-4 bg-base-100 shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <button
            className="btn btn-sm btn-ghost"
            onClick={handlePrevMonth}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          <div className="text-center font-medium">
            {monthNames[month]} {year}
          </div>

          <button
            className="btn btn-sm btn-ghost"
            onClick={handleNextMonth}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {weekdays.map(day => (
            <div key={day} className="text-xs font-medium">{day}</div>
          ))}
          {calendarDays}
        </div>
      </div>
    );
  };

  return (
    <div className="relative" ref={datePickerRef}>
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          type="text"
          className="input input-bordered w-full pr-10"
          placeholder={placeholder}
          value={value}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
        />
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-64">
          {renderCalendar()}
        </div>
      )}
    </div>
  );
};

export default DatePicker;
