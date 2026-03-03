// PRESENTATION LAYER — pure JSX only. No hooks, no business logic.

import { NavbarView } from './components/NavbarView'
import { HeroView } from './components/HeroView'
import { FeaturesView } from './components/FeaturesView'
import { HowItWorksView } from './components/HowItWorksView'
import { PricingView } from './components/PricingView'
import { CtaSectionView } from './components/CtaSectionView'
import { FooterView } from './components/FooterView'

export function LandingView() {
  return (
    <div className="dark min-h-screen bg-[#09090b] text-white">
      <NavbarView />
      <HeroView />
      <FeaturesView />
      <HowItWorksView />
      <PricingView />
      <CtaSectionView />
      <FooterView />
    </div>
  )
}
