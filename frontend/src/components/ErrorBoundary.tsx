import { Component, type ErrorInfo, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/dashboard';
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #ef4444 1px, transparent 0)`, backgroundSize: '40px 40px' }} />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full text-center space-y-10 relative z-10"
                    >
                        <div className="h-24 w-24 bg-red-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto border border-red-500/20">
                            <ShieldAlert className="h-12 w-12 text-red-500" />
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">System <span className="text-red-500">Anomaly.</span></h1>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs px-8 leading-relaxed">
                                An unexpected interruption occurred in the achievement ledger. Encryption protocol has been temporarily halted.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <Button
                                onClick={() => window.location.reload()}
                                className="h-16 rounded-2xl bg-white text-slate-950 hover:bg-red-500 hover:text-white transition-all font-black uppercase tracking-widest text-[10px] gap-2"
                            >
                                <RefreshCw className="h-4 w-4" /> Restart Protocol
                            </Button>
                            <Button
                                variant="outline"
                                onClick={this.handleReset}
                                className="h-16 rounded-2xl border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/5 gap-2"
                            >
                                <Home className="h-4 w-4" /> Return to Command Center
                            </Button>
                        </div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}
