function VocabSRS(props) {
    return React.createElement('div', { className: 'p-4 text-center', style: { color: '#e2e8f0' } },
        React.createElement('h2', { className: 'text-xl font-bold mb-4', style: { color: '#fbbf24' } }, 'VOCABULARIO'),
        React.createElement('p', null, 'Vocabulario SRS — en construcción'),
        React.createElement('p', { className: 'text-sm mt-2', style: { color: '#94a3b8' } },
            'Usa Lexikon para consultar y practicar vocabulario.')
    );
}

window.VocabSRS = VocabSRS;