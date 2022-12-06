import * as React from "react";
import Loader from "../../components/Loader/Loader";
import LoaderContext from "../../contexts/Loader";

interface Props {
    children: React.ReactNode;
  }
  
const LoaderProvider: React.FC<Props> = ({ children }) => {
    const [isLoading, setIsLoading] = React.useState(false);

    const addLoader = React.useCallback(() => {
        setIsLoading(true);
    }, []);

    const removeLoader = React.useCallback(() => {
        setIsLoading(false);
    }, []);

    return (
        <LoaderContext.Provider value={{ addLoader, removeLoader }}>
            {children}
            <Loader isLoading={isLoading} />
        </LoaderContext.Provider>
    );
};

export default LoaderProvider;
