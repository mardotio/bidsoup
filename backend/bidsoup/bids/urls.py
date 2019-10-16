from django.urls import path, include
from rest_framework_nested import routers
from . import views

router = routers.DefaultRouter()
router.register(r'accounts', views.AccountViewSet, base_name='account')
router.register(r'bids', views.BidViewSet, base_name='bid')
router.register(r'biditems', views.BidItemViewSet, base_name='biditem')
router.register(r'bidtasks', views.BidTaskViewSet, base_name='bidtask')
router.register(r'customers', views.CustomerViewSet, base_name='customer')
router.register(r'categories', views.CategoryViewSet, base_name='category')
router.register(r'unittypes', views.UnitTypeViewSet, base_name='unittype')
router.register(r'users', views.UserViewSet, base_name='user')
router.register(r'signup', views.SignupViewSet, base_name='signup')

accounts_router = routers.NestedSimpleRouter(router, r'accounts', lookup='account')
accounts_router.register(r'bids', views.BidViewSet, base_name='account-bid')

bids_router = routers.NestedSimpleRouter(router, r'bids', lookup='bid')
bids_router.register(r'categories', views.CategoryViewSet, base_name='bid-category')
bids_router.register(r'biditems', views.BidItemViewSet, base_name='bid-biditem')
bids_router.register(r'bidtasks', views.BidTaskViewSet, base_name='bid-bidtask')

category_router = routers.NestedSimpleRouter(router, r'categories', lookup='category')
category_router.register(r'biditems', views.BidItemViewSet, base_name='category-biditem')

urlpatterns = [
    path('login/', views.SessionLoginView.as_view()),
    path('csrftoken/', views.get_csrf_token),
    path('confirm/<link>/', views.confirm_from_magic, name='confirm'),
    path('', include(router.urls)),
    path('', include(accounts_router.urls)),
    path('', include(bids_router.urls)),
    path('', include(category_router.urls)),
]
