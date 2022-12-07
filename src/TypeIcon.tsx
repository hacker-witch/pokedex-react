import { ReactComponent as GrassIcon } from './assets/types/grass.svg'
import { ReactComponent as PoisonIcon } from './assets/types/poison.svg'
import { ReactComponent as FireIcon } from './assets/types/fire.svg'

export const TypeIcon = ({ type, className }: { type: string, className: string }) => {
  return type === 'grass'
    ? <GrassIcon className={className} />
    : type === 'poison'
    ? <PoisonIcon className={className} />
    : type === 'fire'
    ? <FireIcon className={className} />
    : null
}