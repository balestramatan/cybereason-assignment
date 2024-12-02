interface IProps {
    name?: string;
    type?: string;
}

function ActiveSearch(props: IProps) {
  const { name, type } = props;
  return (
    <div className="active-filter">
          {name && type
            ? `Showing results for Pokémon with name "${name}" and type "${type}".`
            : name
            ? `Showing results for Pokémon with name "${name}".`
            : `Showing results for Pokémon with type "${type}".`}
    </div>
  )
}

export default ActiveSearch

