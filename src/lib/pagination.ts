import { ITEMS_PER_PAGE } from "@/constants/pagination"

export function calculatePagination(totalCount: number, currentPage: number) {
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)
    return {
      currentPage,
      totalPages,
      totalCount,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    }
  }
  
  