import { Card, CardContent } from '@/components/ui/card'
import { generateSkeletonCards, generatePaginationButtons } from './helpers'
import { SKELETON_CONFIG } from './constants'

export function ShopListSkeleton() {
  return (
    <div className='space-y-6' role='status' aria-label='Loading shops'>
      <div className='space-y-4'>
        {generateSkeletonCards(SKELETON_CONFIG.CARD_COUNT).map((index) => (
          <Card key={index} className='animate-pulse' role='article'>
            <CardContent className='p-6'>
              <div 
                className='h-6 bg-gray-200 rounded mb-2'
                data-testid='skeleton-content'
                aria-hidden='true'
              ></div>
              <div 
                className='h-4 bg-gray-200 rounded w-3/4'
                data-testid='skeleton-content'
                aria-hidden='true'
              ></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skeleton pagination */}
      <div 
        className='flex items-center justify-between'
        data-testid='skeleton-pagination'
        aria-hidden='true'
      >
        <div className='h-4 bg-gray-200 rounded w-48'></div>
        <div className='flex items-center space-x-2'>
          <div className='h-9 bg-gray-200 rounded w-20'></div>
          <div className='flex space-x-1'>
            {generatePaginationButtons(
              SKELETON_CONFIG.PAGINATION_BUTTON_COUNT
            ).map((index) => (
              <div 
                key={index} 
                className='h-9 w-9 bg-gray-200 rounded'
                data-testid='skeleton-pagination-button'
              ></div>
            ))}
          </div>
          <div className='h-9 bg-gray-200 rounded w-16'></div>
        </div>
      </div>
      
      {/* Screen reader announcement */}
      <span className='sr-only'>Loading shops, please wait</span>
    </div>
  )
}
