import { Box, ButtonGroup } from "@mui/material";
import { useState } from "react";
import { type FilterType } from "../../types/FilterType.ts";
import TodoFilterButton from "./TodoFilterButton.tsx";

interface TodoFiltersProps {
    changeFilter: (filter: FilterType) => void,
}

function TodoFilters({ changeFilter }: TodoFiltersProps) {
    const [filter, setFilter] = useState<FilterType>("all")

    const handleFilterChange = (filter: FilterType) => {
        setFilter(filter)
        changeFilter(filter)
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <ButtonGroup variant="outlined" aria-label="todo filter buttons">
                <TodoFilterButton filter='all' currentFilter={filter} updateFilter={handleFilterChange} />
                <TodoFilterButton filter='active' currentFilter={filter} updateFilter={handleFilterChange} />
                <TodoFilterButton filter='completed' currentFilter={filter} updateFilter={handleFilterChange} />
            </ButtonGroup>
        </Box>
    )
}

export default TodoFilters