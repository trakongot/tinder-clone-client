export type Direction = 'left' | 'right' | 'up' | 'down'

export type SwipeHandler = (direction: Direction) => void

export type CardLeftScreenHandler = (direction: Direction) => void

export type SwipeRequirementFulfillUpdate = (direction: Direction) => void

export type SwipeRequirementUnfulfillUpdate = () => void

export type API = {
  swipe: (dir?: Direction) => Promise<void>
  restoreCard: () => Promise<void>
}

export type Props = {
  ref?: React.Ref<API>
  flickOnSwipe?: boolean
  onSwipe?: SwipeHandler
  onCardLeftScreen?: CardLeftScreenHandler
  preventSwipe?: Direction[]
  swipeRequirementType?: 'velocity' | 'position'
  swipeThreshold?: number
  onSwipeRequirementFulfilled?: SwipeRequirementFulfillUpdate
  onSwipeRequirementUnfulfilled?: SwipeRequirementUnfulfillUpdate
  className?: string
  children?: React.ReactNode
}

export type TinderCardType = React.FC<Props>
