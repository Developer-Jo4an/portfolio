export const eventSubscription = (
  {
    target = window, callbacksBus, postfix = "EventListener", actionAdd = "add", actionRemove = "remove"
  }) => {

  const listenerLogic = action => {
    callbacksBus.forEach(({event, callback, options}) => {
      const eventsArray = Array.isArray(event) ? event : [event];

      eventsArray.forEach(event => {
        target[`${action}${postfix}`](event, callback, options);
      });
    });
  };

  listenerLogic(actionAdd);

  return () => listenerLogic(actionRemove);
};
