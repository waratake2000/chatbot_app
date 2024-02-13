class SequenceHandler:
    def __init__(self):
        self.sequence_dispatcher = {}

    def event(self, id: int):
        def decorator(func):
            async def wrapper(websocket, receive_json, *args, **kwargs):
                return await func(id,websocket, receive_json, *args, **kwargs)
            self.sequence_dispatcher[id] = { 'function': wrapper,'next':None, 'continue': None}
            return wrapper
        return decorator

    async def handle_sequence(self, sequence_id:int, *args, **kwargs):
        sequence_info = self.sequence_dispatcher.get(sequence_id)
        if sequence_info and 'function' in sequence_info:
            func = await sequence_info['function'](*args, **kwargs)
            next_id = func['next_id']
            sequence_info['next_id'] = next_id
            sequence_info['continue'] = func['continue']
            print("next_id: ",type(next_id),next_id)
            if sequence_info['continue'] and (next_id in self.sequence_dispatcher.keys()):
                await self.handle_sequence(next_id, *args, **kwargs)
            else:
                print(self.sequence_dispatcher)
                return 0
        else:
            print(f"sequence_id: {sequence_id} is not exists.")
            print(self.sequence_dispatcher)
            return 0
