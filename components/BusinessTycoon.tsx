import React, { useState, useEffect } from 'react';
import { Briefcase, Users, TrendingUp, DollarSign, Coffee, Award } from 'lucide-react';

interface Upgrade {
    id: string;
    name: string;
    cost: number;
    revenuePerSecond: number;
    icon: React.ElementType;
    count: number;
    description: string;
}

const BusinessTycoon: React.FC = () => {
    const [money, setMoney] = useState(0);
    const [lifetimeEarnings, setLifetimeEarnings] = useState(0);
    const [clickValue, setClickValue] = useState(10);

    const [upgrades, setUpgrades] = useState<Upgrade[]>([
        { id: 'intern', name: 'Hire Intern', cost: 100, revenuePerSecond: 5, icon: Coffee, count: 0, description: 'Cheap labor, drinks lots of coffee.' },
        { id: 'dev', name: 'Junior Developer', cost: 500, revenuePerSecond: 25, icon: Users, count: 0, description: 'Writes code, sometimes it works.' },
        { id: 'senior', name: 'Senior Developer', cost: 2000, revenuePerSecond: 120, icon: Briefcase, count: 0, description: 'Solves problems you didn\'t know you had.' },
        { id: 'manager', name: 'Project Manager', cost: 8000, revenuePerSecond: 500, icon: TrendingUp, count: 0, description: 'Keeps everyone on track (mostly).' },
    ]);

    // Auto-generate revenue
    useEffect(() => {
        const timer = setInterval(() => {
            const rps = upgrades.reduce((acc, curr) => acc + (curr.revenuePerSecond * curr.count), 0);
            if (rps > 0) {
                setMoney(prev => prev + rps);
                setLifetimeEarnings(prev => prev + rps);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [upgrades]);

    const handleWork = () => {
        setMoney(prev => prev + clickValue);
        setLifetimeEarnings(prev => prev + clickValue);
    };

    const buyUpgrade = (id: string) => {
        setUpgrades(prev => prev.map(u => {
            if (u.id === id && money >= u.cost) {
                setMoney(m => m - u.cost);
                return { ...u, count: u.count + 1, cost: Math.floor(u.cost * 1.5) };
            }
            return u;
        }));
    };

    const totalRPS = upgrades.reduce((acc, curr) => acc + (curr.revenuePerSecond * curr.count), 0);

    return (
        <div className="flex flex-col h-full bg-slate-900 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-2xl max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-slate-800 p-6 flex justify-between items-center border-b border-slate-700">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Briefcase className="text-blue-500" /> Agency Tycoon
                    </h2>
                    <p className="text-slate-400 text-sm">Build your digital empire!</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-green-400 font-mono flex items-center justify-end gap-1">
                        <DollarSign size={24} /> {money.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500">
                        {totalRPS} / sec
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                {/* Main Action Area */}
                <div className="flex-1 p-8 flex flex-col items-center justify-center bg-slate-900 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 to-transparent pointer-events-none"></div>

                    <div className="mb-8 text-center">
                        <h3 className="text-xl font-bold mb-2 text-blue-200">Current Project</h3>
                        <div className="text-slate-400">Click to complete tasks and earn revenue</div>
                    </div>

                    <button
                        onClick={handleWork}
                        className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 shadow-[0_0_50px_rgba(37,99,235,0.3)] hover:shadow-[0_0_70px_rgba(37,99,235,0.5)] active:scale-95 transition-all flex flex-col items-center justify-center group border-4 border-blue-500/30"
                    >
                        <Briefcase size={48} className="text-white mb-2 group-hover:animate-bounce" />
                        <span className="font-bold text-lg">Do Work</span>
                        <span className="text-xs text-blue-200">+{clickValue}</span>
                    </button>

                    <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-md">
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-center">
                            <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Lifetime Earnings</div>
                            <div className="text-xl font-bold text-white">${lifetimeEarnings.toLocaleString()}</div>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-center">
                            <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Company Value</div>
                            <div className="text-xl font-bold text-white">${(lifetimeEarnings * 1.5).toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                {/* Upgrades Panel */}
                <div className="w-full md:w-80 bg-slate-800 border-l border-slate-700 flex flex-col">
                    <div className="p-4 border-b border-slate-700 bg-slate-800/90 backdrop-blur sticky top-0 z-10">
                        <h3 className="font-bold flex items-center gap-2">
                            <TrendingUp size={18} className="text-green-500" /> Upgrades
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {upgrades.map(upgrade => (
                            <button
                                key={upgrade.id}
                                onClick={() => buyUpgrade(upgrade.id)}
                                disabled={money < upgrade.cost}
                                className={`w-full p-4 rounded-xl border text-left transition-all ${money >= upgrade.cost
                                        ? 'bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-blue-500'
                                        : 'bg-slate-800/50 border-slate-700 opacity-50 cursor-not-allowed'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${money >= upgrade.cost ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-500'}`}>
                                            <upgrade.icon size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{upgrade.name}</div>
                                            <div className="text-xs text-slate-400">Owned: {upgrade.count}</div>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-400 mb-3 leading-relaxed">{upgrade.description}</p>

                                <div className="flex justify-between items-center text-xs">
                                    <div className={`font-bold ${money >= upgrade.cost ? 'text-green-400' : 'text-slate-500'}`}>
                                        ${upgrade.cost.toLocaleString()}
                                    </div>
                                    <div className="text-blue-400">
                                        +{upgrade.revenuePerSecond}/s
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessTycoon;
