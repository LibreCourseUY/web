import type { ImageMetadata } from 'astro';
import browserUse from '@/assets/history/browser-use-hooks.png';
import fastcrud from '@/assets/history/fastcrud-flight.jpg';
import asado from '@/assets/history/first-asado.jpg';
import firstTalk from '@/assets/history/first-talk.jpg';
import popsolutions from '@/assets/history/popsolutions-brasilia.jpg';
import dinner from '@/assets/history/carlos-and-igor.jpg';
import sapari from '@/assets/history/sapari-web-summit.jpg';
import cedula from '@/assets/history/opensc-cedula.jpg';
import pogofest from '@/assets/history/pogofest.jpg';
import enodia from '@/assets/history/enodia-wifi.jpg';
import arch from '@/assets/history/arch-phone.jpg';
import trustsight from '@/assets/history/trustsight-press.jpg';
import fieldwork from '@/assets/history/franco-fieldwork.jpg';
import contactless from '@/assets/history/opensc-contactless.jpg';

type HistoryMoment = {
  date: string;
  title: string;
  caption: string;
  source?: { label: string; href: string };
} & ({ image: ImageMetadata; alt: string } | { image?: undefined; alt?: undefined });

export const historyMoments: HistoryMoment[] = [
  {
    date: '2025-03-27',
    title: 'A contribution to Browser Use',
    caption:
      'Browser Use merged Carlos Planchón’s hooks so developers could run their own code before and after each step of a browser agent.',
    image: browserUse,
    alt: 'The Browser Use pull request for pre- and post-step hooks marked as merged on GitHub.',
    source: {
      label: 'Browser Use pull request #1028',
      href: 'https://github.com/browser-use/browser-use/pull/1028',
    },
  },
  {
    date: '2025-08-09',
    title: 'FastCRUD in flight',
    caption:
      'Reading the docs for Igor Benav’s FastCRUD from the back seat of a plane, somewhere between Mercedes and Montevideo.',
    image: fastcrud,
    alt: 'An open laptop behind the pilot of a small plane, with the horizon visible through the window.',
  },
  {
    date: '2026-01-15',
    title: 'Our first asado',
    caption: 'Nine of us at our first asado.',
    image: asado,
    alt: 'Nine people gathered outdoors for a group selfie at night.',
  },
  {
    date: '2026-03-16',
    title: 'Our first talk at Piso Verde',
    caption:
      'There were 32 of us at the Facultad de Ingeniería in Montevideo for Emiliano Gandini’s introduction to open source. Some stayed afterward to ask questions. After midnight, Emiliano shared the recording in the group chat for anyone who couldn’t make it.',
    image: firstTalk,
    alt: 'Emiliano Gandini holds a marker in front of two whiteboards filled with hand-drawn diagrams and notes on UNIX, GCC, and GNU/Linux.',
  },
  {
    date: '2026-04-18',
    title: 'The first codenight',
    caption:
      'We opened a Discord call that Saturday night for anyone who wanted to bring a project, ask for help, or just listen in. More than thirty people dropped by over eight and a half hours. Four stayed from start to finish.',
  },
  {
    date: '2026-05-22',
    title: 'Digital sovereignty in Brasília',
    caption:
      'Our friends from PopSolutions outside Brazil’s National Congress. Their cooperative advocates for free software that Brazilian public institutions can run and audit themselves.',
    image: popsolutions,
    alt: 'Two people in front of the twin towers and opposing domes of the National Congress.',
  },
  {
    date: '2026-06-09',
    title: 'Dinner with Carlos and Igor',
    caption:
      'Carlos Planchón and Igor Benav at dinner the night before Igor demoed Sapari, his browser-based video editor, at Web Summit Rio.',
    image: dinner,
    alt: 'Two people at a restaurant table with plates and glasses set for dinner.',
  },
  {
    date: '2026-06-10',
    title: 'Sapari at Web Summit Rio',
    caption:
      'Igor and Carlos attended Web Summit Rio, where Igor showed Sapari, his browser-based video editor.',
    image: sapari,
    alt: 'A Sapari T-shirt and a video editing demo at the exhibition stand in Rio de Janeiro.',
  },
  {
    date: '2026-07-24',
    title: 'The Uruguayan cédula in OpenSC',
    caption:
      'OpenSC merged work by Carlos Planchón and Nicolás Gutiérrez that lets people use Uruguay’s electronic identity card with a contact reader.',
    image: cedula,
    alt: 'The merged OpenSC pull request adding support for the Uruguayan national identity card.',
    source: {
      label: 'OpenSC pull request #3729',
      href: 'https://github.com/OpenSC/OpenSC/pull/3729',
    },
  },
  {
    date: '2026-08-02',
    title: 'Pogofest in Montevideo',
    caption: 'A red jumpsuit and a gas mask made it into the group selfie at Pogofest.',
    image: pogofest,
    alt: 'Three festivalgoers posing together under purple lights, one wearing a gas mask.',
  },
  {
    date: '2026-09-24',
    title: 'Finding a street corner with Wi-Fi',
    caption:
      'Carlos Planchón’s Enodia positioning system placed him at the corner of Carlos María Solari and José Pedro Varela using nearby Wi-Fi networks.',
    image: enodia,
    alt: 'A dot on a street map beside a readout of the Wi-Fi networks detected on a walk.',
  },
  {
    date: '2026-10-15',
    title: 'Arch Linux on a phone',
    caption:
      'Franco Feijó ran Arch Linux ARM on his phone. The Termux terminal shows Fastfetch reporting the system details.',
    image: arch,
    alt: 'A phone screen displaying the Arch Linux logo and terminal output above its on-screen keyboard.',
  },
  {
    date: '2026-10-15',
    title: 'TrustSight in BleepingComputer',
    caption:
      'Emiliano Gandini Outeda’s tool TrustSight flagged malicious packages in the Arch User Repository. BleepingComputer covered his findings on October 15.',
    image: trustsight,
    alt: 'An article excerpt naming Emiliano Gandini Outeda and linking to his open source security tool TrustSight.',
    source: {
      label: 'Read the BleepingComputer article',
      href: 'https://www.bleepingcomputer.com/news/security/fake-arch-linux-packages-push-malware-with-root-privileges/',
    },
  },
  {
    date: '2026-10-26',
    title: 'Out in the field',
    caption:
      'Franco Feijó shared this view from the cab of a John Deere sprayer. He built MenchoBot so farm crews could log machine hours and fuel use over WhatsApp.',
    image: fieldwork,
    alt: 'A hand on the steering wheel of a farm machine, a map on the console and open fields beyond the windshield.',
  },
  {
    date: '2026-10-29',
    title: 'The cédula goes contactless',
    caption:
      'Nicolás Gutiérrez followed up on the July contribution. OpenSC merged his PACE support for using the Uruguayan identity card with a contactless reader.',
    image: contactless,
    alt: 'The merged OpenSC pull request for contactless PACE support in the Uruguayan card driver.',
    source: {
      label: 'OpenSC pull request #3805',
      href: 'https://github.com/OpenSC/OpenSC/pull/3805',
    },
  },
].sort((first, second) => first.date.localeCompare(second.date));
