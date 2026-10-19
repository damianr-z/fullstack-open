import useCounter from '../hooks/useCounter'

const Display = () => {
  const { counter } = useCounter()

  return <div>{counter}</div>
}

export default Display
