import { Button } from '@mui/material'
import { type FilterType } from "../../types/FilterType.ts";

interface TodoFilterProps {
    filter: FilterType,
    currentFilter: FilterType,
    updateFilter: (filter: FilterType) => void,
}

function TodoFilterButton({ currentFilter, filter, updateFilter }: TodoFilterProps) {
    return (
        <Button
            onClick={() => updateFilter(filter)}
            variant={filter === currentFilter ? 'contained' : 'outlined'}
            sx={{
                bgcolor: filter === currentFilter ? '#42a5f5' : 'transparent',
                color: filter === currentFilter ? 'white' : '#42a5f5',
                borderColor: '#42a5f5',
                '&:hover': {
                    bgcolor: filter === currentFilter ? '#1e88e5' : '#e3f2fd',
                    borderColor: '#1e88e5',
                },
            }}>
            { filter }
        </Button>
    )
}

export default TodoFilterButton