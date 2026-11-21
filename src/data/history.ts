import type { ImageMetadata } from 'astro';
import browserUse from '@/assets/history/browser-use-hooks.png';
import fastcrud from '@/assets/history/fastcrud-flight.jpg';
import asado from '@/assets/history/first-asado.jpg';
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

interface HistoryMoment {
  date: string;
  title: string;
  caption: string;
  image: ImageMetadata;
  alt: string;
  source?: { label: string; href: string };
}

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
      'The FastCRUD documentation was open on a laptop on the flight from Mercedes to Montevideo.',
    image: fastcrud,
    alt: 'An open laptop behind the pilot of a small plane, with the horizon visible through the window.',
  },
  {
    date: '2026-01-15',
    title: 'Our first asado',
    caption:
      'The first LibreCourseUY barbecue brought the group together for this photo after dark.',
    image: asado,
    alt: 'Nine people gathered outdoors for a group selfie at night.',
  },
  {
    date: '2026-05-22',
    title: 'Digital sovereignty in Brasília',
    caption: 'Our friends at PopSolutions stopped for a photo outside Brazil’s National Congress.',
    image: popsolutions,
    alt: 'Two people in front of the twin towers and opposing domes of the National Congress.',
  },
  {
    date: '2026-06-09',
    title: 'Dinner with Carlos and Igor',
    caption: 'Carlos and Igor shared a meal the day before their photo at the Sapari stand.',
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
      'OpenSC merged work by Carlos Planchón and Nicolás Gutierrez that lets people use Uruguay’s electronic identity card with a contact reader.',
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
    date: '2026-10-17',
    title: 'TrustSight in BleepingComputer',
    caption:
      'This clipping comes from an October 15 report on malicious Arch Linux packages. It describes how Emiliano Gandini Outeda spotted suspicious packages with TrustSight.',
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
      'Franco Feijó shared the view from the cab of a farm machine, with the field ahead and a map beside the wheel.',
    image: fieldwork,
    alt: 'A hand on the steering wheel of a farm machine, a map on the console and open fields beyond the windshield.',
  },
  {
    date: '2026-10-29',
    title: 'The cédula goes contactless',
    caption:
      'Nicolás Gutierrez followed up on the July contribution. OpenSC merged his PACE support for using the Uruguayan identity card with a contactless reader.',
    image: contactless,
    alt: 'The merged OpenSC pull request for contactless PACE support in the Uruguayan card driver.',
    source: {
      label: 'OpenSC pull request #3805',
      href: 'https://github.com/OpenSC/OpenSC/pull/3805',
    },
  },
].sort((first, second) => first.date.localeCompare(second.date));
