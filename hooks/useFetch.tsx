import { useState } from "react";
import { toast } from "sonner";

const useFetch = (cb: (...args: any[]) => Promise<any>) => {
  const [data, setData] = useState<any>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fn = async (...args: any[]) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      setError(null)
    } catch (error) {
      setError(error instanceof Error ? error : new Error('An error occurred'));
      toast.error("There is some error")
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;