import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Server, Activity, MemoryStick, HardDrive, Cpu, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '../store/auth';

export default function AdminMetrics() {
    const [metrics, setMetrics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMetrics = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await api.get('/admin/server-metrics');
            if (res.data.ok) {
                setMetrics(res.data.metrics);
            }
        } catch (err) {
            toast.error("Erro ao carregar métricas do servidor");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, [fetchMetrics]);

    if (isLoading && !metrics) {
        return <div className="p-8 text-slate-400 font-bold uppercase tracking-widest animate-pulse text-center py-40">Coletando métricas...</div>;
    }

    if (!metrics) {
        return (
            <div className="p-8 text-red-400 font-bold uppercase tracking-widest text-center py-40 flex flex-col items-center gap-4">
                <AlertCircle className="w-12 h-12 opacity-50" />
                Erro ao coletar dados do servidor
            </div>
        );
    }

    const formatBytes = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatUptime = (seconds) => {
        const d = Math.floor(seconds / (3600*24));
        const h = Math.floor(seconds % (3600*24) / 3600);
        const m = Math.floor(seconds % 3600 / 60);
        return `${d}d ${h}h ${m}m`;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                        <Activity className="w-6 h-6 text-emerald-500" /> Métricas do Servidor
                    </h2>
                    <p className="text-slate-500 text-sm font-medium mt-1">Status do sistema e uso de recursos em tempo real.</p>
                </div>
                <button 
                    onClick={fetchMetrics}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700/50"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Atualizar
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col gap-4 relative overflow-hidden">
                    <div className="absolute -right-6 -bottom-6 opacity-5"><Server className="w-32 h-32" /></div>
                    <div className="flex justify-between items-start z-10">
                        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Server className="w-5 h-5" /></div>
                        <span className="text-[10px] text-slate-500 font-mono">PID: {metrics.processId || '---'}</span>
                    </div>
                    <div className="z-10 mt-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Uptime</p>
                        <h3 className="text-2xl font-black text-white">{formatUptime(metrics.uptimeSeconds || 0)}</h3>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col gap-4 relative overflow-hidden">
                    <div className="absolute -right-6 -bottom-6 opacity-5"><Cpu className="w-32 h-32" /></div>
                    <div className="flex justify-between items-start z-10">
                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><Cpu className="w-5 h-5" /></div>
                        <span className="text-[10px] text-slate-500 font-mono">{metrics.cpuCores || 0} Cores</span>
                    </div>
                    <div className="z-10 mt-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Uso de CPU</p>
                        <h3 className="text-2xl font-black text-white">{(metrics.cpuUsagePercent || 0).toFixed(1)}%</h3>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
                            <div className="h-full bg-emerald-500 transition-all duration-1000" style={{width: `${metrics.cpuUsagePercent || 0}%`}}></div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col gap-4 relative overflow-hidden">
                    <div className="absolute -right-6 -bottom-6 opacity-5"><MemoryStick className="w-32 h-32" /></div>
                    <div className="flex justify-between items-start z-10">
                        <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl"><MemoryStick className="w-5 h-5" /></div>
                        <span className="text-[10px] text-slate-500 font-mono">{formatBytes(metrics.memoryUsedBytes || 0)}</span>
                    </div>
                    <div className="z-10 mt-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Memória RAM</p>
                        <h3 className="text-2xl font-black text-white">{(metrics.memoryUsagePercent || 0).toFixed(1)}%</h3>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
                            <div className="h-full bg-purple-500 transition-all duration-1000" style={{width: `${metrics.memoryUsagePercent || 0}%`}}></div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col gap-4 relative overflow-hidden">
                    <div className="absolute -right-6 -bottom-6 opacity-5"><HardDrive className="w-32 h-32" /></div>
                    <div className="flex justify-between items-start z-10">
                        <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl"><HardDrive className="w-5 h-5" /></div>
                        <span className="text-[10px] text-slate-500 font-mono">{formatBytes(metrics.diskUsedBytes || 0)}</span>
                    </div>
                    <div className="z-10 mt-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Armazenamento</p>
                        <h3 className="text-2xl font-black text-white">{(metrics.diskUsagePercent || 0).toFixed(1)}%</h3>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
                            <div className="h-full bg-amber-500 transition-all duration-1000" style={{width: `${metrics.diskUsagePercent || 0}%`}}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-6">Informações do Sistema</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <InfoItem label="Plataforma" value={metrics.platform} />
                    <InfoItem label="Node.js" value={metrics.nodeVersion} />
                    <InfoItem label="PID" value={`#${metrics.processId}`} />
                    <InfoItem label="Uptime processo" value={formatUptime(metrics.uptimeSeconds || 0)} />
                    <InfoItem label="RAM total" value={formatBytes(metrics.memoryTotalBytes)} />
                    <InfoItem label="RAM usada" value={formatBytes(metrics.memoryUsedBytes)} color="purple" />
                    <InfoItem label="RAM livre" value={formatBytes(metrics.memoryFreeBytes)} color="emerald" />
                    <InfoItem label="Disco total" value={formatBytes(metrics.diskTotalBytes)} />
                    <InfoItem label="Disco usado" value={formatBytes(metrics.diskUsedBytes)} color="amber" />
                    <InfoItem label="Disco livre" value={formatBytes((metrics.diskTotalBytes || 0) - (metrics.diskUsedBytes || 0))} color="emerald" />
                    <InfoItem label="CPUs" value={`${metrics.cpuCores || '?'} cores`} />
                    <InfoItem label="Carga CPU" value={`${(metrics.cpuUsagePercent || 0).toFixed(2)}%`} color={metrics.cpuUsagePercent > 80 ? 'red' : metrics.cpuUsagePercent > 50 ? 'amber' : 'emerald'} />
                </div>
            </div>
        </div>
    );
}

function InfoItem({ label, value, color }) {
    const colorMap = {
        emerald: 'text-emerald-400',
        purple: 'text-purple-400',
        amber: 'text-amber-400',
        red: 'text-red-400',
    };
    return (
        <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/40">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">{label}</p>
            <p className={`text-sm font-mono font-bold ${colorMap[color] || 'text-slate-200'}`}>{value || 'N/A'}</p>
        </div>
    );
}
