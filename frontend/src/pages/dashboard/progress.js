import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import apiClient from '@/utils/apiClient';
import { toast } from 'react-toastify';
import {
    FiTrendingUp, FiAward, FiCheckCircle, FiClock,
    FiTarget, FiCalendar, FiBook
} from 'react-icons/fi';
import { useApiCall } from '@/hooks/useCommon';
import { LoadingSpinner } from '@/components/ui';

export default function Progress() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const {
        data: progressData,
        loading,
        execute: fetchProgressData
    } = useApiCall(
        () => apiClient.get('/analytics/intern-dashboard').then(res => ({ data: res.data.data })),
        {
            initialData: null,
            errorMessage: 'Failed to load progress data'
        }
    );

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/');
            } else {
                fetchProgressData();
            }
        }
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            </DashboardLayout>
        );
    }

    const stats = [
        {
            label: 'Overall Progress',
            value: `${progressData?.currentEnrollment?.progressPercentage || 0}%`,
            icon: FiTrendingUp,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            label: 'Assignments Completed',
            value: `${progressData?.assignmentStats?.completed || 0}/${progressData?.assignmentStats?.total || 0}`,
            icon: FiCheckCircle,
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
        {
            label: 'Average Score',
            value: progressData?.assignmentStats?.averageScore
                ? `${Math.round(progressData.assignmentStats.averageScore)}%`
                : 'N/A',
            icon: FiAward,
            color: 'bg-yellow-500',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-600'
        },
        {
            label: 'Pending Assignments',
            value: progressData?.assignmentStats?.pending || 0,
            icon: FiClock,
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600'
        }
    ];

    return (
        <>
            <Head>
                <title>My Progress - Dashboard</title>
            </Head>

            <DashboardLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white shadow-lg">
                        <h1 className="text-2xl font-bold mb-1">My Progress</h1>
                        <p className="text-primary-100">Track your learning journey and achievements</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                            <Icon className={`w-6 h-6 ${stat.textColor}`} />
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                    <div className="text-sm text-gray-600">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Current Internship Progress */}
                    {progressData?.currentEnrollment && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Internship</h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            {progressData.currentEnrollment.internship?.title}
                                        </span>
                                        <span className="text-sm font-semibold text-primary-600">
                                            {progressData.currentEnrollment.progressPercentage}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
                                            style={{ width: `${progressData.currentEnrollment.progressPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Enrolled</div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {new Date(progressData.currentEnrollment.enrolledAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Status</div>
                                        <div className="text-sm font-medium capitalize text-gray-900">
                                            {progressData.currentEnrollment.status}
                                        </div>
                                    </div>
                                    {progressData.currentEnrollment.completionDate && (
                                        <div>
                                            <div className="text-xs text-gray-500 mb-1">Completed</div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {new Date(progressData.currentEnrollment.completionDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recent Assignments */}
                    {progressData?.recentAssignments && progressData.recentAssignments.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Assignments</h2>
                            <div className="space-y-3">
                                {progressData.recentAssignments.map((assignment) => (
                                    <div
                                        key={assignment._id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                        onClick={() => router.push(`/dashboard/assignments/${assignment._id}`)}
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                                            <p className="text-sm text-gray-500">
                                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {assignment.submissionStatus === 'submitted' || assignment.submissionStatus === 'graded' ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                    <FiCheckCircle className="w-3.5 h-3.5" />
                                                    {assignment.score !== undefined ? `${assignment.score}/${assignment.maxScore}` : 'Submitted'}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                                    <FiClock className="w-3.5 h-3.5" />
                                                    Pending
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Certificates */}
                    {progressData?.recentCertificates && progressData.recentCertificates.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Certificates Earned</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {progressData.recentCertificates.map((cert) => (
                                    <div
                                        key={cert._id}
                                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                                    >
                                        <div className="p-3 bg-yellow-100 rounded-lg">
                                            <FiAward className="w-8 h-8 text-yellow-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{cert.internship?.title}</h3>
                                            <p className="text-sm text-gray-600">
                                                Issued: {new Date(cert.issueDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!progressData?.currentEnrollment && (
                        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                            <FiBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Internship</h3>
                            <p className="text-gray-500">
                                You're not currently enrolled in any internship. Contact your administrator to get started.
                            </p>
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </>
    );
}
