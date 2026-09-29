
import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { ASSETS } from '../constants';

const Calendar: React.FC = () => {
    const { appointments } = useHealth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    // Calendar Logic
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        return days;
    };

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
        setCurrentDate(new Date(newDate));
    };

    // Helper to check if a date has appointments
    const getAppointmentsForDay = (day: number) => {
        // This is a simplified check. In a real app, you'd parse the appointment date string accurately.
        // Assuming appointment.date format is like "Oct 24, 2024"
        const targetDateStr = `${monthNames[currentDate.getMonth()].slice(0, 3)} ${day}, ${currentDate.getFullYear()}`;
        return appointments.filter(apt => apt.date === targetDateStr);
    };

    const renderCalendarGrid = () => {
        const blanks = Array(firstDay).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const totalSlots = [...blanks, ...days];

        return (
            <div className="grid grid-cols-7 gap-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center py-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        {day}
                    </div>
                ))}
                {totalSlots.map((day, index) => {
                    if (!day) return <div key={`blank-${index}`} className="h-24 md:h-32 rounded-2xl bg-white/5 opacity-20"></div>;

                    const dayAppointments = getAppointmentsForDay(day as number);
                    const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day as number).toDateString();
                    const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === currentDate.getMonth();

                    return (
                        <div
                            key={day}
                            onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day as number))}
                            className={`h-24 md:h-32 rounded-2xl p-3 border transition-all cursor-pointer relative overflow-hidden group
                ${isSelected ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(19,127,236,0.3)]' : 'bg-surface-dark border-white/5 hover:border-white/20 hover:bg-white/5'}
              `}
                        >
                            <div className="flex justify-between items-start">
                                <span className={`text-sm font-bold ${isToday ? 'text-primary bg-primary/10 px-2 py-0.5 rounded-full' : 'text-slate-400'}`}>
                                    {day}
                                </span>
                                {dayAppointments.length > 0 && (
                                    <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(19,127,236,1)]"></span>
                                )}
                            </div>

                            <div className="mt-2 flex flex-col gap-1">
                                {dayAppointments.map((apt, i) => (
                                    <div key={i} className="text-[9px] bg-white/5 p-1 rounded border border-white/5 text-slate-300 truncate">
                                        {apt.time} - {apt.doctor}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const selectedDayAppointments = selectedDate ? getAppointmentsForDay(selectedDate.getDate()) : [];

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col gap-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight">Medical Calendar</h1>
                    <p className="text-slate-400 font-medium">Manage your appointments and follow-ups.</p>
                </div>
                <div className="flex items-center gap-4 bg-surface-dark p-2 rounded-2xl border border-white/5">
                    <button onClick={() => changeMonth(-1)} className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <span className="text-lg font-bold w-40 text-center">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                    <button onClick={() => changeMonth(1)} className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
                <div className="lg:col-span-8 overflow-y-auto">
                    {renderCalendarGrid()}
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-surface-dark border border-white/5 rounded-[2.5rem] p-8 shadow-2xl h-full flex flex-col">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">event</span>
                            {selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : 'Select a date'}
                        </h3>

                        {selectedDayAppointments.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {selectedDayAppointments.map(apt => (
                                    <div key={apt.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group">
                                        <div className="flex gap-4 mb-3">
                                            <div className="w-12 h-12 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url("${apt.imageUrl}")` }} />
                                            <div>
                                                <p className="font-bold text-base">{apt.doctor}</p>
                                                <p className="text-xs text-slate-400 uppercase tracking-wider">{apt.specialty}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-xs font-bold text-slate-300 bg-black/20 p-2 rounded-lg">
                                            <span>{apt.time}</span>
                                            <span className="text-primary uppercase">{apt.type || 'Consultation'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-4 opacity-60">
                                <span className="material-symbols-outlined text-4xl">event_busy</span>
                                <p>No appointments scheduled</p>
                            </div>
                        )}

                        <button className="mt-auto w-full py-4 rounded-2xl bg-primary hover:bg-blue-600 text-white font-bold text-sm uppercase tracking-widest shadow-lg shadow-primary/25 transition-all">
                            Request Appointment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
