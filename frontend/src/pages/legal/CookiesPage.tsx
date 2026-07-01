/** Politique de gestion des cookies — EduTutor IA. */
import LegalScaffold, { type LegalSection } from './LegalScaffold';
import { LEGAL } from './legalConfig';

const SECTIONS: LegalSection[] = [
  {
    title: "Qu'est-ce qu'un cookie ?",
    body: (
      <p>
        Un « cookie » est un petit fichier déposé sur votre appareil lors de la visite d’un site.
        Par extension, on parle aussi de technologies de stockage local du navigateur (par ex.{' '}
        <code className="bg-slate-200 px-1 rounded">localStorage</code>) qui permettent de conserver
        certaines informations entre deux pages ou deux visites.
      </p>
    ),
  },
  {
    title: 'Cookies et stockage utilisés',
    body: (
      <>
        <p>{LEGAL.service} limite le stockage au strict nécessaire au fonctionnement :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Jeton d’authentification</strong> conservé dans le{' '}
            <code className="bg-slate-200 px-1 rounded">localStorage</code> du navigateur, afin de
            vous maintenir connecté ;
          </li>
          <li>
            <strong>Préférence de thème</strong> (mode clair/sombre), le cas échéant, pour mémoriser
            votre choix d’affichage.
          </li>
        </ul>
        <p>
          Aucun cookie publicitaire, ni de suivi tiers, ni de mesure d’audience externe n’est
          utilisé.
        </p>
      </>
    ),
  },
  {
    title: 'Finalité de chaque cookie',
    body: (
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Jeton d’authentification</strong> : finalité strictement technique (vous garder
          connecté et sécuriser l’accès à votre compte).
        </li>
        <li>
          <strong>Préférence de thème</strong> : finalité de confort (mémoriser votre affichage).
        </li>
      </ul>
    ),
  },
  {
    title: 'Consentement',
    body: (
      <p>
        Les éléments utilisés étant <strong>strictement nécessaires</strong> au fonctionnement du
        service, ils ne requièrent pas de consentement préalable au sens de la réglementation. Aucun
        traceur soumis à consentement n’est déposé ; aucune bannière de consentement n’est donc
        nécessaire en l’état.
      </p>
    ),
  },
  {
    title: 'Durée de conservation',
    body: (
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Jeton d’authentification</strong> : conservé jusqu’à votre déconnexion ou son
          expiration.
        </li>
        <li>
          <strong>Préférence de thème</strong> : conservée jusqu’à ce que vous la modifiiez ou
          effaciez le stockage de votre navigateur.
        </li>
      </ul>
    ),
  },
  {
    title: 'Gérer ou refuser les cookies',
    body: (
      <p>
        Vous pouvez à tout moment supprimer ces éléments en effaçant les données de site dans les
        réglages de votre navigateur, ou en vous déconnectant. La suppression du jeton
        d’authentification vous déconnectera simplement du service.
      </p>
    ),
  },
];

export default function CookiesPage() {
  return (
    <LegalScaffold
      title="Politique de gestion des cookies"
      intro="Les cookies et technologies de stockage utilisés par le site, et comment les gérer."
      sections={SECTIONS}
      lastUpdated={LEGAL.derniereMaj}
    />
  );
}
