"use client";
import React, { useState, useEffect } from 'react';
import { 
    Calendar, 
    Clock, 
    CheckCircle2, 
    XCircle, 
    Search,
    ArrowUpDown,
    RefreshCw,
    AlertCircle,
    User,
    Scissors,
    Dumbbell,
    Flame,
    Smartphone,
    X
} from 'lucide-react';

type BookingStatus = 'confirmed' | 'completed' | 'cancelled' | 'pending';

interface Service {
    id: string;
    name: string;
    category: string;
    duration: number;
    price: number;
    professional: string;
}

interface Booking {
    id: string;
    service: Service;
    date: string;
    time: string;
    status: BookingStatus;
    notes?: string;
    createdAt: string;
}

const statusStyles: Record<BookingStatus, { bg: string; text: string; icon: React.ReactElement }> = {
    confirmed: {
        bg: 'bg-green-50 dark:bg-green-900/30',
        text: 'text-green-600 dark:text-green-400',
        icon: <CheckCircle2 className="text-green-600 dark:text-green-400 size-4" />
    },
    completed: {
        bg: 'bg-blue-50 dark:bg-blue-900/30',
        text: 'text-blue-600 dark:text-blue-400',
        icon: <CheckCircle2 className="text-blue-600 dark:text-blue-400 size-4" />
    },
    cancelled: {
        bg: 'bg-red-50 dark:bg-red-900/30',
        text: 'text-red-600 dark:text-red-400',
        icon: <XCircle className="text-red-600 dark:text-red-400 size-4" />
    },
    pending: {
        bg: 'bg-orange-50 dark:bg-orange-900/30',
        text: 'text-orange-600 dark:text-orange-400',
        icon: <Clock className="text-orange-600 dark:text-orange-400 size-4" />
    }
};

const statusText: Record<BookingStatus, string> = {
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    pending: 'Pending'
};

const serviceIcons: Record<string, React.ReactElement> = {
    'hair': <Scissors className="size-5 text-purple-500" />,
    'fitness': <Dumbbell className="size-5 text-blue-500" />,
    'spa': <Flame className="size-5 text-pink-500" />,
    'tech': <Smartphone className="size-5 text-cyan-500" />,
    'default': <User className="size-5 text-gray-500" />
};

const BookingsDashboard = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
    const [activeTab, setActiveTab] = useState<string>('all');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Booking; direction: 'asc' | 'desc' }>({ 
        key: 'date', 
        direction: 'desc' 
    });
    const [rescheduleModal, setRescheduleModal] = useState<{ open: boolean; bookingId: string | null }>({ 
        open: false, 
        bookingId: null 
    });
    const [newDateTime, setNewDateTime] = useState<{ date: string; time: string }>({ 
        date: '', 
        time: '' 
    });

    useEffect(() => {
        const sampleServices: Service[] = [
            {
                id: 'svc-001',
                name: 'Haircut & Styling',
                category: 'hair',
                duration: 60,
                price: 65.00,
                professional: 'Alex Johnson'
            },
            {
                id: 'svc-002',
                name: 'Personal Training',
                category: 'fitness',
                duration: 45,
                price: 75.00,
                professional: 'Jamie Smith'
            },
            {
                id: 'svc-003',
                name: 'Deep Tissue Massage',
                category: 'spa',
                duration: 90,
                price: 120.00,
                professional: 'Taylor Wilson'
            },
            {
                id: 'svc-004',
                name: 'Phone Screen Repair',
                category: 'tech',
                duration: 30,
                price: 89.99,
                professional: 'Casey Brown'
            }
        ];

        const sampleBookings: Booking[] = [
            {
                id: 'bk-78945',
                service: sampleServices[0],
                date: '2023-06-15',
                time: '14:00',
                status: 'confirmed',
                notes: 'Please arrive 10 minutes early for consultation',
                createdAt: '2023-06-01T10:30:00Z'
            },
            {
                id: 'bk-78123',
                service: sampleServices[1],
                date: '2023-06-10',
                time: '09:30',
                status: 'completed',
                createdAt: '2023-05-28T15:45:00Z'
            },
            {
                id: 'bk-77654',
                service: sampleServices[2],
                date: '2023-06-05',
                time: '16:15',
                status: 'pending',
                notes: 'Allergy to lavender oil',
                createdAt: '2023-06-02T08:15:00Z'
            },
            {
                id: 'bk-77231',
                service: sampleServices[3],
                date: '2023-05-28',
                time: '11:00',
                status: 'cancelled',
                createdAt: '2023-05-20T12:00:00Z'
            }
        ];
        
        setBookings(sampleBookings);
        setFilteredBookings(sampleBookings);
    }, []);

    useEffect(() => {
        let result = [...bookings];
        
        if (activeTab !== 'all') {
            result = result.filter(booking => booking.status === activeTab);
        }
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(booking => 
                booking.id.toLowerCase().includes(query) ||
                booking.service.name.toLowerCase().includes(query) ||
                booking.service.professional.toLowerCase().includes(query) ||
                booking.notes?.toLowerCase().includes(query)
            );
        }
        
        result.sort((a, b) => {
            if (sortConfig.key === 'date') {
                const dateTimeA = new Date(`${a.date}T${a.time}`).getTime();
                const dateTimeB = new Date(`${b.date}T${b.time}`).getTime();
                
                if (dateTimeA < dateTimeB) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (dateTimeA > dateTimeB) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            } else {
                if ((a[sortConfig.key] ?? '') < (b[sortConfig.key] ?? '')) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if ((a[sortConfig.key] ?? '') > (b[sortConfig.key] ?? '')) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            }
        });
        
        setFilteredBookings(result);
    }, [bookings, activeTab, searchQuery, sortConfig]);

    const requestSort = (key: keyof Booking) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const openBookingDetails = (booking: Booking) => {
        setSelectedBooking(booking);
    };

    const closeBookingDetails = () => {
        setSelectedBooking(null);
    };

    const openRescheduleModal = (bookingId: string) => {
        const booking = bookings.find(b => b.id === bookingId);
        if (booking) {
            setNewDateTime({ date: booking.date, time: booking.time });
            setRescheduleModal({ open: true, bookingId });
        }
    };

    const closeRescheduleModal = () => {
        setRescheduleModal({ open: false, bookingId: null });
    };

    const handleReschedule = () => {
        if (rescheduleModal.bookingId) {
            setBookings(prev => prev.map(booking => 
                booking.id === rescheduleModal.bookingId 
                    ? { ...booking, date: newDateTime.date, time: newDateTime.time } 
                    : booking
            ));
            closeRescheduleModal();
        }
    };

    const cancelBooking = (bookingId: string) => {
        setBookings(prev => prev.map(booking => 
            booking.id === bookingId 
                ? { ...booking, status: 'cancelled' } 
                : booking
        ));
    };

    const getServiceIcon = (category: string) => {
        return serviceIcons[category] || serviceIcons['default'];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        const [hours, minutes] = timeString.split(':');
        const hourNum = parseInt(hours, 10);
        return `${hourNum > 12 ? hourNum - 12 : hourNum}:${minutes} ${hourNum >= 12 ? 'PM' : 'AM'}`;
    };

    const SortIcon = ({ column }: { column: keyof Booking }) => {
        if (sortConfig.key !== column) return <ArrowUpDown className="size-3 opacity-30" />;
        return sortConfig.direction === 'asc' ? (
            <ArrowUpDown className="size-3" />
        ) : (
            <ArrowUpDown className="size-3" />
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 h-full">
            {rescheduleModal.open && (
                <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Reschedule Booking</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Date</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                                    value={newDateTime.date}
                                    onChange={(e) => setNewDateTime(prev => ({ ...prev, date: e.target.value }))}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Time</label>
                                <input
                                    type="time"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                                    value={newDateTime.time}
                                    onChange={(e) => setNewDateTime(prev => ({ ...prev, time: e.target.value }))}
                                />
                            </div>
                        </div>
                        
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={closeRescheduleModal}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReschedule}
                                className="px-4 py-2 bg-purple-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                disabled={!newDateTime.date || !newDateTime.time}
                            >
                                Confirm Reschedule
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Booking Details</h3>
                            <button
                                onClick={closeBookingDetails}
                                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                            >
                                <X className="size-5" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                {getServiceIcon(selectedBooking.service.category)}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {selectedBooking.service.name}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        with {selectedBooking.service.professional}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Booking ID</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {selectedBooking.id}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                    <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${statusStyles[selectedBooking.status].bg} ${statusStyles[selectedBooking.status].text}`}>
                                        {statusStyles[selectedBooking.status].icon}
                                        {statusText[selectedBooking.status]}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {formatDate(selectedBooking.date)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {formatTime(selectedBooking.time)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {selectedBooking.service.duration} minutes
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        ${selectedBooking.service.price.toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Booked On</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {formatDate(selectedBooking.createdAt)}
                                    </p>
                                </div>
                            </div>
                            
                            {selectedBooking.notes && (
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Special Notes</p>
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 p-3 rounded-r">
                                        <div className="flex items-start">
                                            <AlertCircle className="size-4 text-yellow-500 dark:text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
                                            <p className="text-sm text-yellow-700 dark:text-yellow-300">{selectedBooking.notes}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                                {selectedBooking.status === 'confirmed' && (
                                    <button
                                        onClick={() => {
                                            openRescheduleModal(selectedBooking.id);
                                            closeBookingDetails();
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                    >
                                        <RefreshCw className="size-4" />
                                        Reschedule
                                    </button>
                                )}
                                {selectedBooking.status !== 'completed' && selectedBooking.status !== 'cancelled' && (
                                    <button
                                        onClick={() => {
                                            cancelBooking(selectedBooking.id);
                                            closeBookingDetails();
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        <XCircle className="size-4" />
                                        Cancel Booking
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Calendar className="text-purple-600 dark:text-purple-400 size-6" />
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">My Bookings</h1>
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium px-2.5 py-0.5 rounded-full">
                            {filteredBookings.length} bookings
                        </span>
                    </div>
                    
                    <div className="flex w-full sm:w-auto gap-2">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                            <input
                                type="text"
                                placeholder="Search bookings..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 bg-white dark:bg-gray-700 dark:text-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="border-b border-gray-100 dark:border-gray-700 overflow-x-auto">
                    <div className="flex">
                        {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map((tab) => (
                            <button
                                key={tab}
                                className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                                    activeTab === tab
                                        ? 'border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab === 'all' ? 'All Bookings' : statusText[tab as BookingStatus]}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="hidden md:block">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    {[
                                        { key: 'id', label: 'Booking ID' },
                                        { key: 'service', label: 'Service' },
                                        { key: 'date', label: 'Date & Time' },
                                        { key: 'status', label: 'Status' },
                                        { label: 'Professional' }
                                    ].map((header) => (
                                        <th
                                            key={header.key || header.label}
                                            scope="col"
                                            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
                                                header.key ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600' : ''
                                            }`}
                                            onClick={() => header.key && requestSort(header.key as keyof Booking)}
                                        >
                                            <div className="flex items-center gap-1">
                                                {header.label}
                                                {header.key && <SortIcon column={header.key as keyof Booking} />}
                                            </div>
                                        </th>
                                    ))}
                                    <th scope="col" className="px-6 py-3 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredBookings.length > 0 ? (
                                    filteredBookings.map((booking) => (
                                        <tr 
                                            key={booking.id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                            onClick={() => openBookingDetails(booking)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                {booking.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    {getServiceIcon(booking.service.category)}
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{booking.service.name}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {booking.service.duration} min • ${booking.service.price.toFixed(2)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">{formatDate(booking.date)}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{formatTime(booking.time)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusStyles[booking.status].bg} ${statusStyles[booking.status].text}`}>
                                                    {statusStyles[booking.status].icon}
                                                    {statusText[booking.status]}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {booking.service.professional}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    {booking.status === 'confirmed' && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openRescheduleModal(booking.id);
                                                            }}
                                                            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                                                            title="Reschedule"
                                                        >
                                                            <RefreshCw className="size-4" />
                                                        </button>
                                                    )}
                                                    {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                cancelBooking(booking.id);
                                                            }}
                                                            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                                            title="Cancel"
                                                        >
                                                            <XCircle className="size-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <Calendar className="size-12 mb-3" />
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No bookings found</h3>
                                                <p className="mt-1 dark:text-gray-400">You don not have any bookings matching your criteria.</p>
                                                <button
                                                    onClick={() => {
                                                        setActiveTab('all');
                                                        setSearchQuery('');
                                                    }}
                                                    className="mt-4 px-4 py-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700 rounded-lg font-medium"
                                                >
                                                    Reset filters
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="md:hidden">
                    {filteredBookings.length > 0 ? (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredBookings.map((booking) => (
                                <div 
                                    key={booking.id} 
                                    className="p-4 cursor-pointer"
                                    onClick={() => openBookingDetails(booking)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">{booking.id}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                                                {getServiceIcon(booking.service.category)}
                                                {booking.service.name}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusStyles[booking.status].bg} ${statusStyles[booking.status].text}`}>
                                                {statusStyles[booking.status].icon}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        <div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Date & Time</div>
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {formatDate(booking.date)}, {formatTime(booking.time)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Professional</div>
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {booking.service.professional}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-400">
                                <Calendar className="size-12 mb-3" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No bookings found</h3>
                                <p className="mt-1 dark:text-gray-400">You don not have any bookings matching your criteria.</p>
                                <button
                                    onClick={() => {
                                        setActiveTab('all');
                                        setSearchQuery('');
                                    }}
                                    className="mt-4 px-4 py-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700 rounded-lg font-medium"
                                >
                                    Reset filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingsDashboard;