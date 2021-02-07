type AnyFn = (...args: any) => any;

type ReturnVoid<F extends AnyFn> = (...args: Parameters<F>) => void;

type FunctionMap = { [key: string]: AnyFn };

type VoidFunctionMap<T extends FunctionMap> = {
  [P in keyof T]: ReturnVoid<T[P]>;
};

// Derives Props type from mapStateToProps and mapDispatchToProps
export type ConnectedProps<
  MapStateToProps extends AnyFn,
  MapDispatchToProps extends FunctionMap = {}
> = ReturnType<MapStateToProps> & VoidFunctionMap<MapDispatchToProps>;
