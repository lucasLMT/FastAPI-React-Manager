from datetime import date

def serialize_complex(result):
        if isinstance(result, list):
            return [serialize_complex_single(item) for item in result]
        else:
            return serialize_complex_single(result)

def serialize_complex_single(result):
    data = {c.name: getattr(result, c.name) for c in result.__table__.columns}
    if hasattr(result, 'id'):
        data['id'] = str(data['id'])
    for attrName in data:
        if isinstance(data[attrName], date):
            data[attrName] = str(data[attrName])
    if hasattr(result, 'users'):
        data['users'] = [serialize_complex_single(addr) for addr in result.users]
    if hasattr(result, 'tasks'):
        data['tasks'] = [serialize_complex_single(addr) for addr in result.tasks]
    return data