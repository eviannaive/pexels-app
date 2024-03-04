import styles from './Loading.module.css'

const Loading = () => {
  return <div className="fixed top-0 left-0 text-5xl w-full h-full flex justify-center items-center bg-gray-700/30 z-[9999]">
    <div className={styles.loader} />
  </div>
}

export default Loading
