import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorDetail: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, errorDetail: error?.message || String(error) };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Critical Render Error caught by Boundary:", error, errorInfo);
    }

    // Reseta quando a rota muda (resetKey prop passada pelo App)
    componentDidUpdate(prevProps) {
        if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
            this.setState({ hasError: false, errorDetail: null });
        }
    }

    render() {
        if (this.state.hasError) {
            const isTranslateError = this.state.errorDetail?.includes('removeChild') || this.state.errorDetail?.includes('not a child');
            return (
                <div style={{
                    height: '100vh', width: '100vw', backgroundColor: '#0B0F19',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', color: 'white', fontFamily: 'sans-serif',
                    textAlign: 'center', padding: '20px', position: 'fixed',
                    top: 0, left: 0, zIndex: 999999
                }}>
                    <div style={{ fontSize: '50px', marginBottom: '20px' }}>⚠️</div>
                    <h1 style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', fontStyle: 'italic', marginBottom: '10px' }}>
                        Erro de Interface
                    </h1>
                    {isTranslateError ? (
                        <p style={{ color: '#94a3b8', maxWidth: '440px', marginBottom: '10px', lineHeight: '1.6' }}>
                            Extensão de tradução do browser (ex: Google Translate) modificou o DOM e causou este erro.
                            <br />
                            <strong style={{ color: '#f59e0b' }}>Desative a tradução automática</strong> para este site e recarregue.
                        </p>
                    ) : (
                        <p style={{ color: '#94a3b8', maxWidth: '400px', marginBottom: '30px', lineHeight: '1.5' }}>
                            Ocorreu um erro na renderização. Tente recarregar.
                        </p>
                    )}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button
                            onClick={() => this.setState({ hasError: false, errorDetail: null })}
                            style={{ padding: '12px 24px', backgroundColor: '#1e293b', color: 'white', border: '1px solid #334155', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}
                        >
                            Tentar Novamente
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            style={{ padding: '12px 24px', backgroundColor: '#f59e0b', color: 'black', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}
                        >
                            Recarregar Página
                        </button>
                    </div>
                    {!isTranslateError && this.state.errorDetail && (
                        <details style={{ marginTop: '20px', maxWidth: '600px', textAlign: 'left' }}>
                            <summary style={{ cursor: 'pointer', color: '#64748b', fontSize: '11px', fontFamily: 'monospace' }}>Detalhes do erro (debug)</summary>
                            <pre style={{ color: '#f87171', fontSize: '10px', marginTop: '8px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: '#1e293b', padding: '12px', borderRadius: '8px' }}>
                                {this.state.errorDetail}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;

        if (this.state.hasError) {
            // UI de emergência ultra-simples (sem dependências externas)
            return (
                <div style={{
                    height: '100vh',
                    width: '100vw',
                    backgroundColor: '#0B0F19',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontFamily: 'sans-serif',
                    textAlign: 'center',
                    padding: '20px',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 999999
                }}>
                    <div style={{ fontSize: '50px', marginBottom: '20px' }}>⚠️</div>
                    <h1 style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', fontStyle: 'italic', marginBottom: '10px' }}>
                        Erro de Interface
                    </h1>
                    <p style={{ color: '#94a3b8', maxWidth: '400px', marginBottom: '30px', lineHeight: '1.5' }}>
                        Ocorreu um erro crítico na renderização. Isso acontece quando alguns dados da conta estão inconsistentes.
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#3B82F6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: '900',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            fontSize: '12px',
                            letterSpacing: '1px'
                        }}
                    >
                        Recarregar Plataforma
                    </button>
                    {this.state.errorDetail && (
                        <details style={{ marginTop: '20px', maxWidth: '600px', textAlign: 'left' }}>
                            <summary style={{ cursor: 'pointer', color: '#64748b', fontSize: '11px', fontFamily: 'monospace' }}>Detalhes do erro (debug)</summary>
                            <pre style={{ color: '#f87171', fontSize: '10px', marginTop: '8px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: '#1e293b', padding: '12px', borderRadius: '8px' }}>
                                {this.state.errorDetail}{'\n\n'}{this.state.errorStack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
