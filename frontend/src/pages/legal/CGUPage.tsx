/** Conditions Générales d'Utilisation — EduTutor IA. */
import LegalScaffold, { type LegalSection } from './LegalScaffold';
import { LEGAL } from './legalConfig';

const SECTIONS: LegalSection[] = [
  {
    title: 'Objet',
    body: (
      <p>
        Les présentes Conditions Générales d’Utilisation (CGU) définissent les modalités d’accès et
        d’utilisation du service {LEGAL.service}, plateforme de révision permettant de générer des
        quiz personnalisés à partir de documents de cours à l’aide d’une intelligence artificielle.
      </p>
    ),
  },
  {
    title: 'Acceptation des conditions',
    body: (
      <p>
        La création d’un compte et l’utilisation du service impliquent l’acceptation pleine et
        entière des présentes CGU. Si vous n’acceptez pas ces conditions, vous ne devez pas utiliser{' '}
        {LEGAL.service}.
      </p>
    ),
  },
  {
    title: 'Accès au service',
    body: (
      <>
        <p>
          Le service est accessible via un navigateur web récent et une connexion internet.
          Certaines fonctionnalités nécessitent la création d’un compte et la validation de votre
          adresse e-mail.
        </p>
        <p>
          L’éditeur s’efforce d’assurer la disponibilité du service mais ne peut la garantir sans
          interruption, notamment en cas de maintenance ou de contrainte technique.
        </p>
      </>
    ),
  },
  {
    title: 'Compte utilisateur',
    body: (
      <p>
        Vous êtes responsable de l’exactitude des informations fournies et de la confidentialité de
        votre mot de passe. Toute activité réalisée depuis votre compte est réputée effectuée par
        vous. En cas d’utilisation non autorisée, prévenez sans délai l’éditeur.
      </p>
    ),
  },
  {
    title: 'Comportements interdits',
    body: (
      <ul className="list-disc pl-5 space-y-1">
        <li>importer des contenus illicites ou dont vous ne détenez pas les droits ;</li>
        <li>tenter de porter atteinte à la sécurité ou au fonctionnement du service ;</li>
        <li>
          tenter de détourner l’IA de son usage prévu (par ex. injection d’instructions
          malveillantes) ;
        </li>
        <li>utiliser le service à des fins frauduleuses ou pour nuire à autrui.</li>
      </ul>
    ),
  },
  {
    title: 'Contenu généré par IA',
    body: (
      <p>
        Les quiz sont produits automatiquement par un modèle de langage. Ils constituent une aide à
        la révision et <strong>peuvent contenir des erreurs ou des imprécisions</strong>. Il vous
        appartient de vérifier les informations auprès de vos supports de cours officiels. L’éditeur
        ne saurait être tenu responsable des conséquences d’une erreur du contenu généré.
      </p>
    ),
  },
  {
    title: 'Responsabilité',
    body: (
      <p>
        {LEGAL.service} est fourni « en l’état », dans un cadre pédagogique et non commercial. La
        responsabilité de l’éditeur ne peut être engagée pour les dommages indirects résultant de
        l’utilisation ou de l’impossibilité d’utiliser le service.
      </p>
    ),
  },
  {
    title: 'Propriété intellectuelle',
    body: (
      <p>
        Le service et ses composants restent la propriété de l’éditeur. Les documents que vous
        importez et vos données restent votre propriété : vous concédez uniquement à {LEGAL.service}{' '}
        le droit de les traiter pour vous fournir le service (génération de quiz, suivi).
      </p>
    ),
  },
  {
    title: 'Modification des CGU',
    body: (
      <p>
        L’éditeur peut faire évoluer les présentes CGU. La version applicable est celle publiée sur
        cette page à la date de votre utilisation. Les modifications importantes pourront être
        signalées aux utilisateurs.
      </p>
    ),
  },
  {
    title: 'Droit applicable et litiges',
    body: (
      <p>
        Les présentes CGU sont soumises au droit français. En cas de litige, une solution amiable
        sera recherchée en priorité ; à défaut, les tribunaux français seront compétents. Pour toute
        question, contactez <strong>{LEGAL.email}</strong>.
      </p>
    ),
  },
];

export default function CGUPage() {
  return (
    <LegalScaffold
      title="Conditions Générales d'Utilisation"
      intro="Les règles d'utilisation du service EduTutor IA, acceptées par chaque utilisateur."
      sections={SECTIONS}
      lastUpdated={LEGAL.derniereMaj}
    />
  );
}
