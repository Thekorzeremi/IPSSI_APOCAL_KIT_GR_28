/** Mentions légales — EduTutor IA. */
import LegalScaffold, { type LegalSection } from './LegalScaffold';
import { LEGAL } from './legalConfig';

const SECTIONS: LegalSection[] = [
  {
    title: 'Éditeur du site',
    body: (
      <>
        <p>
          Le site {LEGAL.service} est édité par : <strong>{LEGAL.editeur}</strong>.
        </p>
        <p>{LEGAL.statut}.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Adresse : {LEGAL.adresse}</li>
          <li>Courriel : {LEGAL.email}</li>
        </ul>
        <p>
          {LEGAL.service} est une plateforme de révision qui génère des quiz personnalisés à partir
          de documents de cours, à l’aide d’un modèle de langage (IA).
        </p>
      </>
    ),
  },
  {
    title: 'Directeur de la publication',
    body: (
      <p>
        Le directeur de la publication est <strong>{LEGAL.directeurPublication}</strong>,
        représentant de l’équipe éditrice. Il est responsable du contenu mis en ligne sur{' '}
        {LEGAL.service}.
      </p>
    ),
  },
  {
    title: 'Hébergeur',
    body: (
      <>
        <p>Le site est hébergé par :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>{LEGAL.hebergeur}</strong>
          </li>
          <li>{LEGAL.hebergeurAdresse}</li>
          <li>Téléphone : {LEGAL.hebergeurTel}</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Propriété intellectuelle',
    body: (
      <>
        <p>
          L’ensemble des éléments du site {LEGAL.service} (structure, textes, interface, logo, code
          source produit par l’équipe) est protégé par le droit de la propriété intellectuelle.
          Toute reproduction ou réutilisation sans autorisation préalable est interdite.
        </p>
        <p>
          Les documents de cours importés par un utilisateur restent la propriété de celui-ci ; il
          garantit disposer des droits nécessaires pour les téléverser. Les quiz générés par l’IA
          sont fournis à titre d’aide à la révision et peuvent comporter des erreurs.
        </p>
        <p>
          Ce projet est diffusé dans un cadre pédagogique et non commercial ; la base de code
          d’origine est distribuée sous licence CC BY-NC-SA 4.0.
        </p>
      </>
    ),
  },
  {
    title: 'Contact',
    body: (
      <p>
        Pour toute question d’ordre juridique ou relative au contenu du site, vous pouvez écrire à{' '}
        <strong>{LEGAL.email}</strong>. Pour les questions relatives aux données personnelles,
        consultez la{' '}
        <a href="/legal/confidentialite" className="text-indigo-700 underline hover:no-underline">
          politique de confidentialité
        </a>
        .
      </p>
    ),
  },
];

export default function MentionsLegalesPage() {
  return (
    <LegalScaffold
      title="Mentions légales"
      intro="Informations légales obligatoires identifiant l'éditeur et l'hébergeur du site."
      sections={SECTIONS}
      lastUpdated={LEGAL.derniereMaj}
    />
  );
}
