/** Politique de rétention des données personnelles (RGPD Art. 5(1)(e), 13, 17). */
export default function PolitiqueRetentionPage() {
  return (
    <article className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        Politique de rétention des données personnelles
      </h1>
      <p className="text-slate-600 mb-8">
        Responsable du traitement&nbsp;: Équipe EduTutor IA — Groupe 28 &middot; Référence&nbsp;:
        RGPD (UE) 2016/679 — Art. 5(1)(e), 13, 17
      </p>

      {/* Section 1 — Durées */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          1. Durées de conservation par type de donnée
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700">
                <th className="text-left px-3 py-2 border border-slate-200 font-medium">
                  Type de donnée
                </th>
                <th className="text-left px-3 py-2 border border-slate-200 font-medium">
                  Durée
                </th>
                <th className="text-left px-3 py-2 border border-slate-200 font-medium">
                  Déclencheur
                </th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {RETENTION_ROWS.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="px-3 py-2 border border-slate-200">{row.type}</td>
                  <td className="px-3 py-2 border border-slate-200 whitespace-nowrap">{row.duration}</td>
                  <td className="px-3 py-2 border border-slate-200 text-slate-500">{row.trigger}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-slate-500 italic">
          Compte inactif depuis plus de 24 mois&nbsp;: notification par email 30 jours avant
          expiration, puis suppression automatique en l'absence de réactivation.
        </p>
      </section>

      {/* Section 2 — Motifs légaux */}
      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          2. Motifs légaux de conservation (Art. 6 RGPD)
        </h2>

        <div className="p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded">
          <p className="font-medium text-indigo-900 mb-1">
            Données de compte &amp; contenus pédagogiques
          </p>
          <p className="text-sm text-indigo-800">
            <span className="font-semibold">Exécution d'un contrat (Art. 6(1)(b))</span> — La
            conservation est nécessaire à la fourniture du service de révision personnalisée.
          </p>
        </div>

        <div className="p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded">
          <p className="font-medium text-indigo-900 mb-1">Réponses aux quiz &amp; scores</p>
          <p className="text-sm text-indigo-800">
            <span className="font-semibold">
              Exécution du contrat (Art. 6(1)(b)) + Intérêt légitime (Art. 6(1)(f))
            </span>{' '}
            — Indispensable au moteur de recommandation pédagogique (suivi de progression).
          </p>
        </div>

        <div className="p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded">
          <p className="font-medium text-indigo-900 mb-1">Signalements</p>
          <p className="text-sm text-indigo-800">
            <span className="font-semibold">
              Obligation légale (Art. 6(1)(c)) + Intérêt légitime (Art. 6(1)(f))
            </span>{' '}
            — 3 ans correspondant à la prescription civile de droit commun (Art. 2224 Code civil).
          </p>
        </div>

        <div className="p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded">
          <p className="font-medium text-indigo-900 mb-1">Logs d'audit</p>
          <p className="text-sm text-indigo-800">
            <span className="font-semibold">
              Obligation légale (Art. 6(1)(c)) + Intérêt légitime sécurité (Art. 6(1)(f))
            </span>{' '}
            — 12 mois recommandés par la CNIL pour la sécurité des systèmes d'information.
          </p>
        </div>

        <div className="p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded">
          <p className="font-medium text-indigo-900 mb-1">Demandes SAR (Art. 15 RGPD)</p>
          <p className="text-sm text-indigo-800">
            <span className="font-semibold">Obligation légale (Art. 6(1)(c))</span> — 5 ans pour
            justifier la conformité lors d'un contrôle CNIL (accountability Art. 5(2)).
          </p>
        </div>
      </section>

      {/* Section 3 — Suppression */}
      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          3. Modalités de suppression (Art. 17 RGPD — Droit à l'oubli)
        </h2>

        <div>
          <h3 className="font-semibold text-slate-800 mb-2">3.1 Suppression automatique (purge planifiée)</h3>
          <p className="text-sm text-slate-700">
            Une tâche automatisée s'exécute <strong>quotidiennement à 02h00 UTC</strong> et supprime
            les comptes inactifs dépassant 24 mois, les logs d'audit de plus de 12 mois et les
            tokens de session expirés. La suppression est <strong>définitive et irréversible</strong>.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-slate-800 mb-2">3.2 Suppression sur demande</h3>
          <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside">
            <li>
              <strong>Via l'interface</strong>&nbsp;: bouton «&nbsp;Supprimer mon compte&nbsp;» dans
              la page Profil → suppression sous <strong>72&nbsp;heures</strong>.
            </li>
            <li>
              <strong>Par email</strong>&nbsp;:{' '}
              <a
                href="mailto:dpo@edututor-ia.example"
                className="text-indigo-600 hover:underline"
              >
                dpo@edututor-ia.example
              </a>{' '}
              avec preuve d'identité. Délai légal&nbsp;: 30 jours (Art. 12(3) RGPD).
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-slate-800 mb-2">3.3 Exceptions (Art. 17(3) RGPD)</h3>
          <p className="text-sm text-slate-700">
            Le droit à l'effacement ne s'applique pas en cas d'obligation légale de conservation ou
            de défense de droits en justice. L'utilisateur est informé par écrit de la limitation et
            de sa durée.
          </p>
        </div>

        <div className="p-4 bg-slate-100 rounded text-sm text-slate-700">
          <p className="font-medium mb-1">Procédure technique de suppression</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Anonymisation des agrégats statistiques (données non personnelles conservées).</li>
            <li>Suppression physique en base de données (cascade sur toutes les tables liées).</li>
            <li>Révocation de tous les tokens actifs de l'utilisateur.</li>
            <li>
              Journalisation de l'opération dans l'audit trail SAR avec statut{' '}
              <code className="bg-white px-1 rounded">DELETED</code> (sans données résiduelles).
            </li>
          </ol>
        </div>
      </section>

      <p className="text-xs text-slate-400 mt-10 pt-4 border-t border-slate-200">
        Dernière mise à jour&nbsp;: 1er juillet 2026. Document rédigé dans le cadre pédagogique
        APOCAL'IPSSI 2026 — Groupe 28.
      </p>
    </article>
  );
}

const RETENTION_ROWS = [
  {
    type: 'Données de compte (email, nom, mot de passe hashé)',
    duration: 'Durée du compte + 12 mois',
    trigger: 'Désactivation ou suppression du compte',
  },
  {
    type: 'Contenus uploadés (textes, documents)',
    duration: 'Durée du compte actif',
    trigger: `Dernière activité de l'utilisateur`,
  },
  {
    type: 'Quiz générés',
    duration: 'Durée du compte + 6 mois',
    trigger: `Dernière activité de l'utilisateur`,
  },
  {
    type: 'Réponses aux quiz et scores',
    duration: 'Durée du compte + 6 mois',
    trigger: `Dernière activité de l'utilisateur`,
  },
  {
    type: 'Signalements émis',
    duration: '3 ans',
    trigger: "Date d'émission du signalement",
  },
  {
    type: "Logs d'audit et d'accès",
    duration: '12 mois',
    trigger: 'Date de génération du log',
  },
  {
    type: 'Demandes SAR (Art. 15 RGPD)',
    duration: '5 ans',
    trigger: 'Date de la demande',
  },
  {
    type: 'Tokens de session / JWT',
    duration: '24 heures',
    trigger: "Date d'émission ou révocation explicite",
  },
];
