import { ReactComponent as BugIcon } from './assets/types/bug.svg'
import { ReactComponent as DarkIcon } from './assets/types/dark.svg'
import { ReactComponent as DragonIcon } from './assets/types/dragon.svg'
import { ReactComponent as ElectricIcon } from './assets/types/electric.svg'
import { ReactComponent as FairyIcon } from './assets/types/fairy.svg'
import { ReactComponent as FightingIcon } from './assets/types/fighting.svg'
import { ReactComponent as FireIcon } from './assets/types/fire.svg'
import { ReactComponent as FlyingIcon } from './assets/types/flying.svg'
import { ReactComponent as GhostIcon } from './assets/types/ghost.svg'
import { ReactComponent as GrassIcon } from './assets/types/grass.svg'
import { ReactComponent as GroundIcon } from './assets/types/ground.svg'
import { ReactComponent as IceIcon } from './assets/types/ice.svg'
import { ReactComponent as NormalIcon } from './assets/types/normal.svg'
import { ReactComponent as PoisonIcon } from './assets/types/poison.svg'
import { ReactComponent as PsychicIcon } from './assets/types/psychic.svg'
import { ReactComponent as RockIcon } from './assets/types/rock.svg'
import { ReactComponent as SteelIcon } from './assets/types/steel.svg'
import { ReactComponent as WaterIcon } from './assets/types/water.svg'
import type { PokemonType } from './PokemonType'

export const TypeIcon = ({ type, className }: { type: PokemonType, className: string }) => {
  switch(type) {
    case 'bug':
      return <BugIcon className={className} />
    case 'dark':
      return <DarkIcon className={className} />
    case 'dragon':
      return <DragonIcon className={className} />
    case 'electric':
      return <ElectricIcon className={className} />
    case 'fairy':
      return <FairyIcon className={className} />
    case 'fighting':
      return <FightingIcon className={className} />
    case 'fire':
      return <FireIcon className={className} />
    case 'flying':
      return <FlyingIcon className={className} />
    case 'ghost':
      return <GhostIcon className={className} />
    case 'grass':
      return <GrassIcon className={className} />
    case 'ground':
      return <GroundIcon className={className} />
    case 'ice':
      return <IceIcon className={className} />
    case 'normal':
      return <NormalIcon className={className} />
    case 'poison':
      return <PoisonIcon className={className} />
    case 'psychic':
      return <PsychicIcon className={className} />
    case 'rock':
      return <RockIcon className={className} />
    case 'steel':
      return <SteelIcon className={className} />
    case 'water':
      return <WaterIcon className={className} />
  }
}