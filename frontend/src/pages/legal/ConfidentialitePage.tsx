/** Politique de confidentialité — EduTutor IA (RGPD). */
import LegalScaffold, { type LegalSection } from './LegalScaffold';
import { LEGAL } from './legalConfig';

const SECTIONS: LegalSection[] = [
  {
    title: 'Responsable du traitement',
    body: (
      <p>
        Le responsable du traitement des données personnelles est <strong>{LEGAL.editeur}</strong> (
        {LEGAL.statut}). Pour toute question relative à vos données, vous pouvez contacter le
        référent données à l’adresse <strong>{LEGAL.dpoEmail}</strong>.
      </p>
    ),
  },
  {
    title: 'Données personnelles collectées',
    body: (
      <>
        <p>Dans le cadre de l’utilisation de {LEGAL.service}, nous collectons :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Données de compte</strong> : adresse e-mail, mot de passe (stocké de façon
            chiffrée/hachée), et le cas échéant nom et prénom renseignés dans le profil.
          </li>
          <li>
            <strong>Contenus fournis</strong> : documents de cours importés (PDF ou texte) utilisés
            pour générer les quiz.
          </li>
          <li>
            <strong>Données d’usage</strong> : quiz générés, réponses, scores et historique de
            révision.
          </li>
          <li>
            <strong>Données techniques minimales</strong> nécessaires au fonctionnement et à la
            sécurité (par ex. journaux d’authentification).
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Finalités du traitement',
    body: (
      <>
        <p>Vos données sont utilisées uniquement pour :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>créer et gérer votre compte utilisateur ;</li>
          <li>générer des quiz personnalisés à partir de vos documents ;</li>
          <li>suivre votre progression (tableau de bord, révision des erreurs, historique) ;</li>
          <li>assurer la sécurité du service et prévenir les abus.</li>
        </ul>
        <p>
          Vos données ne sont ni vendues, ni utilisées à des fins publicitaires, ni exploitées pour
          entraîner des modèles d’IA.
        </p>
      </>
    ),
  },
  {
    title: 'Base légale',
    body: (
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Exécution du contrat</strong> (RGPD art. 6.1.b) : gestion du compte et fourniture
          du service de génération de quiz.
        </li>
        <li>
          <strong>Consentement</strong> (art. 6.1.a) : import de vos documents de cours, que vous
          pouvez retirer à tout moment.
        </li>
        <li>
          <strong>Intérêt légitime</strong> (art. 6.1.f) : sécurité du service et prévention de la
          fraude.
        </li>
      </ul>
    ),
  },
  {
    title: 'Durée de conservation',
    body: (
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Compte et données associées</strong> : conservés tant que le compte est actif,
          puis supprimés en cas de demande de suppression du compte.
        </li>
        <li>
          <strong>Documents importés</strong> : conservés le temps nécessaire à la génération et à
          la consultation des quiz associés ; supprimés avec le compte.
        </li>
        <li>
          <strong>Comptes inactifs</strong> : susceptibles d’être supprimés ou anonymisés après une
          période prolongée d’inactivité.
        </li>
      </ul>
    ),
  },
  {
    title: 'Destinataires des données',
    body: (
      <>
        <p>
          Vos données sont accessibles uniquement à l’équipe {LEGAL.service} habilitée.
          Interviennent également, en tant que prestataires techniques :
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>l’hébergeur du site ({LEGAL.hebergeur}) ;</li>
          <li>
            le moteur d’IA utilisé pour générer les quiz. Par défaut, il s’agit de{' '}
            {LEGAL.llmParDefaut}, c’est-à-dire{' '}
            <strong>sans envoi de vos contenus à un tiers</strong>.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Transferts hors UE',
    body: (
      <p>
        Dans sa configuration par défaut, {LEGAL.service} traite les données au sein de l’Union
        européenne et n’effectue <strong>aucun transfert hors UE</strong>, l’IA étant exécutée
        localement. Si un fournisseur d’IA externe venait à être activé, tout transfert éventuel
        serait encadré par les garanties prévues par le RGPD (clauses contractuelles types) et
        signalé dans la présente politique.
      </p>
    ),
  },
  {
    title: 'Vos droits',
    body: (
      <>
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>droit d’accès (art. 15) ;</li>
          <li>droit de rectification (art. 16) ;</li>
          <li>droit à l’effacement (art. 17) ;</li>
          <li>droit à la portabilité de vos données (art. 20), via l’export de vos données ;</li>
          <li>droit d’opposition et de limitation (art. 18 et 21).</li>
        </ul>
        <p>
          Vous pouvez exercer ces droits depuis votre{' '}
          <a href="/profile" className="text-indigo-700 underline hover:no-underline">
            page profil
          </a>{' '}
          ou en écrivant à <strong>{LEGAL.dpoEmail}</strong>.
        </p>
      </>
    ),
  },
  {
    title: 'Cookies',
    body: (
      <p>
        {LEGAL.service} n’utilise pas de cookies publicitaires ou de suivi. Les détails sur le
        stockage technique employé (jeton d’authentification) figurent dans notre{' '}
        <a href="/legal/cookies" className="text-indigo-700 underline hover:no-underline">
          politique de gestion des cookies
        </a>
        .
      </p>
    ),
  },
  {
    title: 'Contact & réclamation',
    body: (
      <>
        <p>
          Pour toute question ou pour exercer vos droits, contactez le référent données à{' '}
          <strong>{LEGAL.dpoEmail}</strong>.
        </p>
        <p>
          Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous
          pouvez introduire une réclamation auprès de la <strong>CNIL</strong> (
          <a
            href="https://www.cnil.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-700 underline hover:no-underline"
          >
            www.cnil.fr
          </a>
          ).
        </p>
      </>
    ),
  },
];

export default function ConfidentialitePage() {
  return (
    <LegalScaffold
      title="Politique de confidentialité"
      intro="Comment les données personnelles des utilisateurs sont collectées, utilisées et protégées (RGPD)."
      sections={SECTIONS}
      lastUpdated={LEGAL.derniereMaj}
    />
  );
}
