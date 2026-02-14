import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Users, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { hackathonApi } from '@/lib/api';

interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    hackathon: any;
    user: any;
}

const RegistrationModal = ({ isOpen, onClose, hackathon, user }: RegistrationModalProps) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleIndividualRegister = async () => {
        setLoading(true);
        // Simulate API call for individual registration
        // In a real app, this would call hackathonApi.register(hackathon.id, user.id)
        setTimeout(() => {
            setLoading(false);
            toast.success("Successfully registered!");
            onClose();
            // Refresh logic or redirect
        }, 1500);
    };

    const handleTeamCreation = () => {
        onClose();
        navigate(`/student/team/create?hackathonId=${hackathon.id}&name=${encodeURIComponent(hackathon.title)}`);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] rounded-[2rem] p-0 overflow-hidden bg-white dark:bg-slate-900 border-none transition-all duration-300">
                <div className="p-8">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-3xl font-black">Join {hackathon.title}</DialogTitle>
                        <DialogDescription className="text-lg">
                            Choose how you want to participate in this event.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6">
                        {/* Individual Option */}
                        <div
                            className="group relative p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-800 hover:border-blue-500 cursor-pointer transition-all bg-slate-50 dark:bg-slate-800/50"
                            onClick={handleIndividualRegister}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center">
                                    <Users className="h-6 w-6" />
                                </div>
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700">Solo</Badge>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Register as Individual</h3>
                            <p className="text-sm text-slate-500 font-medium mb-4">
                                Join solo and find a team later, or compete on your own if allowed.
                            </p>
                            <Button
                                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700"
                                disabled={loading}
                            >
                                {loading ? 'Registering...' : 'Join Solo'}
                            </Button>
                        </div>

                        {/* Team Option */}
                        <div
                            className="group relative p-6 rounded-3xl border-2 border-[hsl(var(--teal))]/20 hover:border-[hsl(var(--teal))] bg-[hsl(var(--teal))]/5 cursor-pointer transition-all"
                            onClick={handleTeamCreation}
                        >
                            <div className="absolute top-4 right-4">
                                <Badge className="bg-[hsl(var(--teal))] text-white border-none">Recommended</Badge>
                            </div>
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-12 w-12 bg-[hsl(var(--teal))]/20 text-[hsl(var(--teal))] rounded-2xl flex items-center justify-center">
                                    <Users className="h-6 w-6" />
                                </div>
                                <Badge variant="secondary" className="bg-[hsl(var(--teal))]/10 text-[hsl(var(--teal))]">Team</Badge>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Create a Team</h3>
                            <p className="text-sm text-slate-500 font-medium mb-4">
                                Create a new team, invite members, and manage your project.
                            </p>
                            <Button className="w-full rounded-xl bg-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/90 text-white font-bold">
                                Create Team <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RegistrationModal;
