'use client';

import { useState, useEffect } from 'react';
import { FiCheck, FiX, FiCalendar, FiUser, FiClock, FiMapPin } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Booking {
    id: string;
    customerName: string;
    serviceName: string;
    date: string;
    time: string;
    duration: number;
    price: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    customerEmail: string;
    customerPhone: string;
    notes: string;
    declineReason?: string;
}

export default function BusinessBookingPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [declineReason, setDeclineReason] = useState('');
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [currentDeclineId, setCurrentDeclineId] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const dummyBookings: Booking[] = [
                {
                    id: '1',
                    customerName: 'John Smith',
                    serviceName: 'Premium Haircut',
                    date: '2023-11-15',
                    time: '14:00',
                    duration: 45,
                    price: 45,
                    status: 'pending',
                    customerEmail: 'john.smith@example.com',
                    customerPhone: '+1 (555) 123-4567',
                    notes: 'Would like a fade on the sides'
                },
                {
                    id: '2',
                    customerName: 'Sarah Johnson',
                    serviceName: 'Deluxe Hair Color',
                    date: '2023-11-16',
                    time: '10:30',
                    duration: 120,
                    price: 85,
                    status: 'confirmed',
                    customerEmail: 'sarah.j@example.com',
                    customerPhone: '+1 (555) 987-6543',
                    notes: 'Want to go from brunette to blonde'
                },
                {
                    id: '3',
                    customerName: 'Michael Brown',
                    serviceName: 'Beard Trim & Shape',
                    date: '2023-11-14',
                    time: '16:15',
                    duration: 30,
                    price: 25,
                    status: 'cancelled',
                    customerEmail: 'michael.b@example.com',
                    customerPhone: '+1 (555) 456-7890',
                    notes: '',
                    declineReason: 'No available slots at requested time'
                },
                {
                    id: '4',
                    customerName: 'Emily Davis',
                    serviceName: 'Scalp Massage',
                    date: '2023-11-17',
                    time: '11:00',
                    duration: 45,
                    price: 35,
                    status: 'pending',
                    customerEmail: 'emily.d@example.com',
                    customerPhone: '+1 (555) 234-5678',
                    notes: 'Suffering from dry scalp'
                }
            ];
            
            setBookings(dummyBookings);
        } catch (error) {
            toast.error('Failed to load bookings');
            console.error('Error fetching bookings:', error);
        } finally {
            setIsLoading(false);
        }
        };
        
        fetchBookings();
    }, []);

    const handleAcceptBooking = async (id: string) => {
        try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setBookings(bookings.map(booking => 
            booking.id === id ? { ...booking, status: 'confirmed' } : booking
        ));
        
        toast.success('Booking confirmed successfully');
        } catch (error) {
        toast.error('Failed to confirm booking');
        console.error('Error confirming booking:', error);
        } finally {
        setIsLoading(false);
        }
    };

    const handleDeclineBooking = async () => {
        if (!currentDeclineId || !declineReason) return;
        
        try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setBookings(bookings.map(booking => 
            booking.id === currentDeclineId ? { 
            ...booking, 
            status: 'cancelled',
            declineReason 
            } : booking
        ));
        
        toast.success('Booking declined successfully');
        setShowDeclineModal(false);
        setDeclineReason('');
        setCurrentDeclineId(null);
        } catch (error) {
        toast.error('Failed to decline booking');
        console.error('Error declining booking:', error);
        } finally {
        setIsLoading(false);
        }
    };

    const openDeclineModal = (id: string) => {
        setCurrentDeclineId(id);
        setShowDeclineModal(true);
    };

    const countByStatus = (status: string) => {
        return bookings.filter(booking => booking.status === status).length;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
                <p className="mt-2 text-sm text-gray-700">
                View and manage customer bookings
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* Pending Card */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-yellow-800">Pending</h3>
                    <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {countByStatus('pending')}
                    </span>
                </div>
                <p className="mt-2 text-sm text-yellow-700">
                    Bookings awaiting your confirmation
                </p>
                </div>

                {/* Confirmed Card */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-green-800">Confirmed</h3>
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {countByStatus('confirmed')}
                    </span>
                </div>
                <p className="mt-2 text-sm text-green-700">
                    Upcoming appointments
                </p>
                </div>

                {/* Cancelled Card */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-red-800">Cancelled</h3>
                    <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {countByStatus('cancelled')}
                    </span>
                </div>
                <p className="mt-2 text-sm text-red-700">
                    Declined or cancelled bookings
                </p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-12">
                <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                    All customer bookings will appear here
                </p>
                </div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.map((booking) => (
                        <tr 
                            key={booking.id} 
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => setSelectedBooking(booking)}
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <FiUser className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                                <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                                </div>
                            </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{booking.serviceName}</div>
                            <div className="text-sm text-gray-500">${booking.price.toFixed(2)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                                {new Date(booking.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">
                                {booking.time} ({booking.duration} mins)
                            </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                booking.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : booking.status === 'cancelled' 
                                    ? 'bg-red-100 text-red-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {booking.status === 'pending' && (
                                <div className="flex space-x-2">
                                <button
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    handleAcceptBooking(booking.id);
                                    }}
                                    className="text-green-600 hover:text-green-900"
                                    title="Accept Booking"
                                >
                                    <FiCheck className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    openDeclineModal(booking.id);
                                    }}
                                    className="text-red-600 hover:text-red-900"
                                    title="Decline Booking"
                                >
                                    <FiX className="h-5 w-5" />
                                </button>
                                </div>
                            )}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>
            )}

            {selectedBooking && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        Booking Details
                    </h3>
                    </div>
                    <div className="px-6 py-4 space-y-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiUser className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">{selectedBooking.customerName}</h4>
                        <p className="text-sm text-gray-500">{selectedBooking.customerEmail}</p>
                        <p className="text-sm text-gray-500 mt-1">{selectedBooking.customerPhone}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Service Information</h4>
                        <div className="flex items-center mt-1">
                            <FiCalendar className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{selectedBooking.serviceName}</span>
                        </div>
                        <div className="flex items-center mt-1">
                            <FiClock className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                            {new Date(selectedBooking.date).toLocaleDateString()} at {selectedBooking.time} ({selectedBooking.duration} mins)
                            </span>
                        </div>
                        <div className="flex items-center mt-1">
                            <FiMapPin className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">Your Business Location</span>
                        </div>
                        <div className="mt-2">
                            <span className="text-sm font-medium text-gray-900">${selectedBooking.price.toFixed(2)}</span>
                        </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
                        <div className="flex items-center">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            selectedBooking.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : selectedBooking.status === 'cancelled' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                            </span>
                        </div>

                        {selectedBooking.notes && (
                            <>
                            <h4 className="text-sm font-medium text-gray-500 mt-4 mb-2">Customer Notes</h4>
                            <p className="text-sm text-gray-700">{selectedBooking.notes}</p>
                            </>
                        )}

                        {selectedBooking.declineReason && (
                            <>
                            <h4 className="text-sm font-medium text-gray-500 mt-4 mb-2">Decline Reason</h4>
                            <p className="text-sm text-gray-700">{selectedBooking.declineReason}</p>
                            </>
                        )}
                        </div>
                    </div>
                    </div>
                    <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={() => setSelectedBooking(null)}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Close
                    </button>
                    </div>
                </div>
                </div>
            )}

            {showDeclineModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                    <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        Decline Booking
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Please provide a reason for declining this booking
                    </p>
                    </div>
                    <div className="px-6 py-4">
                    <div className="mb-4">
                        <label htmlFor="declineReason" className="block text-sm font-medium text-gray-700 mb-1">
                        Reason *
                        </label>
                        <textarea
                        id="declineReason"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={declineReason}
                        onChange={(e) => setDeclineReason(e.target.value)}
                        placeholder="E.g., No available slots, service not offered, etc."
                        />
                    </div>
                    </div>
                    <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                        onClick={() => {
                        setShowDeclineModal(false);
                        setDeclineReason('');
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDeclineBooking}
                        disabled={!declineReason}
                        className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                        !declineReason ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        Confirm Decline
                    </button>
                    </div>
                </div>
                </div>
            )}
        </div>
    );
}