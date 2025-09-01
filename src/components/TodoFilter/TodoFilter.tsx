import { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[] | null;

  setFilter: (todos: Todo[] | null) => void;
};

type FilterPosts = 'all' | 'active' | 'completed';

export const TodoFilter: React.FC<Props> = ({ todos, setFilter }) => {
  const [selectedStatus, setSelectedStatus] = useState<FilterPosts>('all');
  const [query, setQuery] = useState('');

  const handleCloseModal = () => {
    setQuery('');
  };

  useEffect(() => {
    if (!todos) {
      setFilter(null);

      return;
    }

    let filtered = todos;

    if (selectedStatus === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    }

    if (selectedStatus === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    }

    if (query.trim() !== '') {
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(query.toLowerCase()),
      );
    }

    setFilter(filtered);
  }, [todos, selectedStatus, query, setFilter]);

  return (
    <form className="field has-addons">
      <p className="control">
        <span className="select">
          <select
            value={selectedStatus}
            onChange={e => {
              const value = e.target.value as FilterPosts;

              setSelectedStatus(value);
            }}
            data-cy="statusSelect"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </span>
      </p>

      <p className="control is-expanded has-icons-left has-icons-right">
        <input
          data-cy="searchInput"
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
          }}
          className="input"
          placeholder="Search..."
        />
        <span className="icon is-left">
          <i className="fas fa-magnifying-glass" />
        </span>

        {query && (
          <span className="icon is-right" style={{ pointerEvents: 'all' }}>
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button
              data-cy="clearSearchButton"
              type="button"
              className="delete"
              onClick={handleCloseModal}
            />
          </span>
        )}
      </p>
    </form>
  );
};
