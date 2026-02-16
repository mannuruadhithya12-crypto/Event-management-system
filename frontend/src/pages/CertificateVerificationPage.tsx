import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Award, Calendar, User, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const CertificateVerificationPage = () => {
    const { certificateId, verificationCode } = useParams<{ certificateId: string; verificationCode: string }>();
    const [certificate, setCertificate] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        verifyCertificate();
    }, [certificateId, verificationCode]);

    const verifyCertificate = async () => {
        try {
            setLoading(true);
            // TODO: Implement verification API
            const response = await fetch(`/api/certificates/verify/${certificateId}/${verificationCode}`);

            if (response.ok) {
                const data = await response.json();
                setCertificate(data);
                setVerified(data.status === 'VERIFIED');
            } else {
                setVerified(false);
                toast.error('Certificate verification failed');
            }
        } catch (error: any) {
            console.error('Verification error:', error);
            setVerified(false);
            toast.error('Failed to verify certificate');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
                <Card className="w-full max-w-2xl">
                    <CardContent className="p-8">
                        <Skeleton className="h-64 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl"
            >
                <Card className="border-2 border-slate-700">
                    <CardHeader className="text-center pb-4">
                        <div className="flex justify-center mb-4">
                            {verified ? (
                                <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <CheckCircle className="h-12 w-12 text-green-500" />
                                </div>
                            ) : (
                                <div className="h-20 w-20 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <XCircle className="h-12 w-12 text-red-500" />
                                </div>
                            )}
                        </div>
                        <CardTitle className="text-3xl">
                            {verified ? 'Certificate Verified' : 'Verification Failed'}
                        </CardTitle>
                        <p className="text-slate-400 mt-2">
                            {verified
                                ? 'This certificate is authentic and has been issued by our institution'
                                : 'This certificate could not be verified or has been revoked'}
                        </p>
                    </CardHeader>

                    {verified && certificate && (
                        <CardContent className="space-y-6">
                            {/* Certificate Details */}
                            <div className="bg-slate-800/50 rounded-lg p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Award className="h-5 w-5 text-blue-400" />
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-400">Certificate Title</p>
                                        <p className="font-semibold">{certificate.title}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-blue-400" />
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-400">Recipient</p>
                                        <p className="font-semibold">{certificate.studentName}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-blue-400" />
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-400">Issued On</p>
                                        <p className="font-semibold">
                                            {certificate.issuedAt ? new Date(certificate.issuedAt).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Building className="h-5 w-5 text-blue-400" />
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-400">Category</p>
                                        <Badge variant="outline">{certificate.category}</Badge>
                                    </div>
                                </div>

                                {certificate.role && (
                                    <div className="flex items-center gap-3">
                                        <Award className="h-5 w-5 text-blue-400" />
                                        <div className="flex-1">
                                            <p className="text-sm text-slate-400">Role/Achievement</p>
                                            <p className="font-semibold">{certificate.role}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Certificate ID */}
                            <div className="text-center">
                                <p className="text-sm text-slate-400 mb-1">Certificate ID</p>
                                <p className="font-mono text-lg font-semibold text-blue-400">{certificate.certificateId}</p>
                            </div>

                            {/* Status Badge */}
                            <div className="flex justify-center">
                                <Badge className="bg-green-500 text-white px-6 py-2 text-base">
                                    ✓ Verified & Authentic
                                </Badge>
                            </div>
                        </CardContent>
                    )}

                    {!verified && (
                        <CardContent>
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
                                <p className="text-red-400">
                                    This certificate could not be verified. Please check the QR code or verification link.
                                </p>
                            </div>
                        </CardContent>
                    )}
                </Card>
            </motion.div>
        </div>
    );
};

export default CertificateVerificationPage;
