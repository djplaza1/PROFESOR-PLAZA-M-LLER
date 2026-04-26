function TelcLevels(props) {
    return React.createElement('div', { className: 'p-4 text-center', style: { color: '#e2e8f0' } },
        React.createElement('h2', { className: 'text-xl font-bold mb-4', style: { color: '#fbbf24' } }, 'TELC'),
        React.createElement('p', null, 'Niveles TELC — en construcción'),
        React.createElement('p', { className: 'text-sm mt-2', style: { color: '#94a3b8' } },
            'Información sobre niveles y preparación para exámenes TELC.')
    );
}